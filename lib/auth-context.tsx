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
          }
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
      switchTier,
      signOut,
      refresh,
    }),
    [user, loading, online, signInEmail, signInAnonymous, switchTier, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
