'use client';

import { useState } from 'react';
import SettingsSection, { Field, Toggle } from './SettingsSection';

export default function ProfileSettings() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePublic, setProfilePublic] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  return (
    <SettingsSection
      title="Public profile"
      description="Only visible on email-tier accounts."
    >
      <Field label="Username" hint="Your handle on tomorrowme.">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@yourhandle"
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm font-mono focus:border-seal focus:outline-none"
        />
      </Field>

      <Field label="Display name">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm focus:border-seal focus:outline-none"
        />
      </Field>

      <Field label="Bio" hint="Up to 280 characters. Markdown supported.">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 280))}
          rows={3}
          placeholder="A line about you."
          className="bg-cream border border-border-subtle rounded-paper px-4 py-3 body-sm w-full focus:border-seal focus:outline-none resize-none"
        />
      </Field>

      <Field label="Profile visibility" hint="Who can see your profile.">
        <select className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm">
          <option>Public</option>
          <option>Followers only</option>
          <option>Hidden</option>
        </select>
      </Field>

      <Field label="Discoverable in /explore" hint="Appear in public capsule gallery.">
        <Toggle checked={discoverable} onChange={setDiscoverable} />
      </Field>

      <Field label="Allow reactions" hint="Others can react to your unlocked capsules.">
        <Toggle checked={showReactions} onChange={setShowReactions} />
      </Field>

      <Field label="Allow comments" hint="Others can comment on your unlocked capsules.">
        <Toggle checked={allowComments} onChange={setAllowComments} />
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save changes</button>
      </div>
    </SettingsSection>
  );
}
