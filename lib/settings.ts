'use client';

/**
 * Persistent user settings.
 * Online → Supabase `user_settings` (jsonb); offline → localStorage.
 * The local cache (tm:settings:<userId>) is always kept so reads never block.
 */

export interface UserSettings {
  // profile
  username: string;
  displayName: string;
  bio: string;
  profilePublic: boolean;
  discoverable: boolean;
  showReactions: boolean;
  allowComments: boolean;

  // capsule defaults
  defaultVisibility: 'private' | 'unlisted' | 'public';
  unlockPreset: string;
  sizeCapMb: string;
  timeLockChain: string;

  // notifications
  emailMaster: boolean;
  t30: boolean;
  t7: boolean;
  t1: boolean;
  t0: boolean;
  digest: boolean;
  invites: boolean;
  reactions: boolean;
  product: boolean;
  push: boolean;
  quietHours: boolean;

  // security
  verificationDepth: 'standard' | 'paranoid';
  anchorOnStellar: boolean;
  inactivityWipe: 'never' | '6m' | '1y' | '2y';

  // privacy
  searchIndex: boolean;
  analytics: boolean;
  ipLog: 'hash' | 'none' | 'full';
  improvement: boolean;
  research: boolean;

  // appearance
  theme: 'light' | 'dark' | 'sepia' | 'system';
  motion: 'auto' | 'always' | 'never';
  fontSize: 'small' | 'medium' | 'large';
  lang: string;
  density: 'comfortable' | 'compact';
}

export const DEFAULT_SETTINGS: UserSettings = {
  username: '',
  displayName: '',
  bio: '',
  profilePublic: true,
  discoverable: true,
  showReactions: true,
  allowComments: true,

  defaultVisibility: 'private',
  unlockPreset: '6m',
  sizeCapMb: '100',
  timeLockChain: 'default',

  emailMaster: true,
  t30: false,
  t7: true,
  t1: true,
  t0: true,
  digest: false,
  invites: true,
  reactions: true,
  product: false,
  push: false,
  quietHours: false,

  verificationDepth: 'standard',
  anchorOnStellar: true,
  inactivityWipe: 'never',

  searchIndex: true,
  analytics: false,
  ipLog: 'hash',
  improvement: false,
  research: false,

  theme: 'system',
  motion: 'auto',
  fontSize: 'medium',
  lang: 'en',
  density: 'comfortable',
};

const KEY_PREFIX = 'tm:settings:';

export function loadSettings(userId: string): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(userId: string, settings: UserSettings): void {
  localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(settings));
  if (typeof window !== 'undefined') {
    import('./backend')
      .then(({ getSupabase }) => {
        const sb = getSupabase();
        if (sb) {
          void Promise.resolve(
            sb.from('user_settings').upsert({ user_id: userId, settings: settings as never })
          ).catch(() => {});
        }
      })
      .catch(() => {});
  }
}

/**
 * Online-aware load: pulls settings from Supabase when available, otherwise
 * the local cache/default.
 */
export async function loadSettingsAsync(userId: string): Promise<UserSettings> {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const { getSupabase } = await import('./backend');
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .maybeSingle();
      if (data?.settings) {
        const merged = { ...DEFAULT_SETTINGS, ...(data.settings as Partial<UserSettings>) };
        localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // fall through to local
  }
  return loadSettings(userId);
}

/** Load settings for a user or the default shape (for non-signed-in use). */
export function loadSettingsOr(userId: string | null | undefined): UserSettings {
  return userId ? loadSettings(userId) : { ...DEFAULT_SETTINGS };
}
