'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getSupabase, supabaseEnabled } from './supabase';
import { STORAGE, type TierId } from './constants';
import { generateRecoveryKey, userIdFromRecoveryKey, hashRecoveryKey } from './recovery';

export type AuthTier = TierId | null;

export interface SessionUser {
  id: string;
  tier: TierId;
  email?: string | null;
  displayName?: string | null;
  recoveryKey?: string;
  recoveryKeyHash?: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  online: boolean;
  signInEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signInAnonymous: () => Promise<{ ok: boolean; error?: string; recoveryKey?: string }>;
  signInPasskey: () => Promise<{ ok: boolean; error?: string; userId?: string }>;
  signOut: () => Promise<void>;
  switchTier: (tier: TierId) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const online = supabaseEnabled();

  const refresh = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const localTier = localStorage.getItem(STORAGE.tierKey) as TierId | null;
    const localUserId = localStorage.getItem(STORAGE.userIdKey);
    const localRecovery = localStorage.getItem(STORAGE.recoveryKeyLocal);

    if (localTier && localUserId) {
      setUser({
        id: localUserId,
        tier: localTier,
        email: localStorage.getItem('tm:user-email'),
        recoveryKey: localRecovery ?? undefined,
        recoveryKeyHash: localRecovery ? hashRecoveryKey(localRecovery) : undefined,
      });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      // Bootstrap saved appearance (theme, font size) before paint.
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('tm:settings:' + localStorage.getItem(STORAGE.userIdKey));
        if (raw) {
          try {
            const s = JSON.parse(raw) as { theme?: string; fontSize?: string };
            const root = document.documentElement;
            if (s.theme && s.theme !== 'system') {
              root.setAttribute('data-theme', s.theme);
              root.style.colorScheme = s.theme;
            }
            if (s.fontSize) {
              root.style.fontSize =
                s.fontSize === 'large' ? '112.5%' : s.fontSize === 'small' ? '93.75%' : '100%';
            }
          } catch {
            /* ignore */
          }
        }
      }
      setLoading(true);
      if (online) {
        const sb = getSupabase();
        if (sb) {
          const { data } = await sb.auth.getSession();
          if (data.session?.user) {
            const tier = (localStorage.getItem(STORAGE.tierKey) as TierId) || 'email';
            setUser({
              id: data.session.user.id,
              tier,
              email: data.session.user.email ?? null,
            });
            // Ensure the profile row exists for Supabase-backed storage.
            try {
              const { ensureUserProfile } = await import('@/lib/backend');
              await ensureUserProfile({
                id: data.session.user.id,
                email: data.session.user.email,
                tier,
              });
            } catch {
              /* best-effort */
            }
          }
          // React to auth changes (magic-link confirm, sign-out elsewhere).
          const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              const tier = (localStorage.getItem(STORAGE.tierKey) as TierId) || 'email';
              setUser({
                id: session.user.id,
                tier,
                email: session.user.email ?? null,
              });
            } else if (!localStorage.getItem(STORAGE.userIdKey)) {
              setUser(null);
            }
          });
          return () => sub.subscription.unsubscribe();
        }
      }
      await refresh();
      setLoading(false);
    })();
  }, [online, refresh]);

  const signInEmail = useCallback(
    async (email: string): Promise<{ ok: boolean; error?: string }> => {
      if (!email || !email.includes('@')) {
        return { ok: false, error: 'Please enter a valid email.' };
      }

      if (online) {
        const sb = getSupabase();
        if (sb) {
          const { error } = await sb.auth.signInWithOtp({ email });
          if (error) return { ok: false, error: error.message };
        }
      }

      // Always set local tier so the user proceeds even in offline mode.
      const userId = 'user_' + hashRecoveryKey(email).slice(0, 16);
      localStorage.setItem(STORAGE.tierKey, 'email');
      localStorage.setItem(STORAGE.userIdKey, userId);
      localStorage.setItem('tm:user-email', email);

      await refresh();
      return { ok: true };
    },
    [online, refresh]
  );

  const signInAnonymous = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
    recoveryKey?: string;
  }> => {
    const recoveryKey = generateRecoveryKey();
    const userId = userIdFromRecoveryKey(recoveryKey);
    const keyHash = hashRecoveryKey(recoveryKey);

    localStorage.setItem(STORAGE.tierKey, 'anonymous');
    localStorage.setItem(STORAGE.userIdKey, userId);
    localStorage.setItem(STORAGE.recoveryKeyLocal, recoveryKey);

    await refresh();
    return { ok: true, recoveryKey };
  }, [refresh]);

  const signInPasskey = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
    userId?: string;
  }> => {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Passkey sign-in requires a browser.' };
    }

    const { authenticatePasskey, listPasskeys } = await import('./passkeys');
    const knownUsers = Object.keys(localStorage)
      .filter((k) => k.startsWith('tm:passkeys:'))
      .map((k) => k.replace('tm:passkeys:', ''));

    if (knownUsers.length === 0) {
      return { ok: false, error: 'No passkey account found on this device.' };
    }

    // Try each known user until one authenticates.
    for (const userId of knownUsers) {
      if (listPasskeys(userId).length === 0) continue;
      try {
        await authenticatePasskey({ userId });
        localStorage.setItem(STORAGE.tierKey, 'passkey');
        localStorage.setItem(STORAGE.userIdKey, userId);
        await refresh();
        return { ok: true, userId };
      } catch {
        // try the next account
      }
    }

    return { ok: false, error: 'Passkey verification failed. Please try again.' };
  }, [refresh]);

  const switchTier = useCallback(
    async (tier: TierId): Promise<{ ok: boolean; error?: string }> => {
      localStorage.setItem(STORAGE.tierKey, tier);
      await refresh();
      return { ok: true };
    },
    [refresh]
  );

  const signOut = useCallback(async () => {
    if (online) {
      const sb = getSupabase();
      if (sb) await sb.auth.signOut();
    }
    localStorage.removeItem(STORAGE.tierKey);
    localStorage.removeItem(STORAGE.userIdKey);
    localStorage.removeItem(STORAGE.recoveryKeyLocal);
    localStorage.removeItem('tm:user-email');
    setUser(null);
  }, [online]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      online,
      signInEmail,
      signInAnonymous,
      signInPasskey,
      switchTier,
      signOut,
      refresh,
    }),
    [user, loading, online, signInEmail, signInAnonymous, signInPasskey, switchTier, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
