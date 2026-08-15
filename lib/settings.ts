'use client';

/**
 * Persistent user settings. Stored in localStorage under a single key per
 * user (tm:settings:<userId>), so preferences survive reloads and follow the
 * account across the demo's local-device scope.
 *
 * In a production deployment these would sync to Supabase; the local store
 * is the offline/static-export equivalent.
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
}

/** Load settings for a user or the default shape (for non-signed-in use). */
export function loadSettingsOr(userId: string | null | undefined): UserSettings {
  return userId ? loadSettings(userId) : { ...DEFAULT_SETTINGS };
}
