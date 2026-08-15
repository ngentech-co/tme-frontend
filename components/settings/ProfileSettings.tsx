'use client';

import SettingsSection, { Field, Toggle } from './SettingsSection';
import { useSettings } from '@/lib/use-settings';
import { useAuth } from '@/lib/auth-context';

export default function ProfileSettings() {
  const { user } = useAuth();
  const { settings, update } = useSettings();
  const isEmail = user?.tier === 'email';

  if (!isEmail) {
    return (
      <SettingsSection
        title="Public profile"
        description="Public profiles are an email-tier feature."
      >
        <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
          <p className="body text-ink-soft">
            Switch to an email account to enable your public profile.
          </p>
        </div>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Public profile"
      description="Only visible on email-tier accounts. Changes save automatically."
    >
      <Field label="Username" hint="Your handle on tomorrowme.">
        <input
          type="text"
          value={settings.username}
          onChange={(e) => update({ username: e.target.value })}
          placeholder="@yourhandle"
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm font-mono focus:border-seal focus:outline-none"
        />
      </Field>

      <Field label="Display name">
        <input
          type="text"
          value={settings.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
          placeholder="Your name"
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm focus:border-seal focus:outline-none"
        />
      </Field>

      <Field label="Bio" hint="Up to 280 characters. Markdown supported.">
        <textarea
          value={settings.bio}
          onChange={(e) => update({ bio: e.target.value.slice(0, 280) })}
          rows={3}
          placeholder="A line about you."
          className="bg-cream border border-border-subtle rounded-paper px-4 py-3 body-sm w-full focus:border-seal focus:outline-none resize-none"
        />
      </Field>

      <Field label="Discoverable in /explore" hint="Appear in public capsule gallery.">
        <Toggle checked={settings.discoverable} onChange={(v) => update({ discoverable: v })} />
      </Field>

      <Field label="Allow reactions" hint="Others can react to your unlocked capsules.">
        <Toggle checked={settings.showReactions} onChange={(v) => update({ showReactions: v })} />
      </Field>

      <Field label="Allow comments" hint="Others can comment on your unlocked capsules.">
        <Toggle checked={settings.allowComments} onChange={(v) => update({ allowComments: v })} />
      </Field>

      <p className="mono text-ink-soft mt-8">saved automatically</p>
    </SettingsSection>
  );
}
