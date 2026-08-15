'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  loadSettingsAsync,
  saveSettings,
  DEFAULT_SETTINGS,
  type UserSettings,
} from '@/lib/settings';

/**
 * Load + save user settings. Returns the settings object and an updater that
 * persists on every change (local + Supabase when online).
 */
export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!user) return;
    loadSettingsAsync(user.id).then(setSettings);
  }, [user]);

  const update = useCallback(
    (patch: Partial<UserSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        if (user) saveSettings(user.id, next);
        return next;
      });
    },
    [user]
  );

  return { settings, update };
}
