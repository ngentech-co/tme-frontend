'use client';

import { useState } from 'react';
import SettingsSection, { Field, Toggle } from './SettingsSection';

export default function NotificationsSettings() {
  const [emailMaster, setEmailMaster] = useState(true);
  const [t30, setT30] = useState(false);
  const [t7, setT7] = useState(true);
  const [t1, setT1] = useState(true);
  const [t0, setT0] = useState(true);
  const [digest, setDigest] = useState(false);
  const [invites, setInvites] = useState(true);
  const [reactions, setReactions] = useState(true);
  const [product, setProduct] = useState(false);
  const [push, setPush] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <SettingsSection
      title="Notifications"
      description="What we tell you, and when."
    >
      <Field label="Email notifications" hint="Master switch for all email.">
        <Toggle checked={emailMaster} onChange={setEmailMaster} />
      </Field>

      <Field label="T-30 days reminder">
        <Toggle checked={t30} onChange={setT30} disabled={!emailMaster} />
      </Field>
      <Field label="T-7 days reminder">
        <Toggle checked={t7} onChange={setT7} disabled={!emailMaster} />
      </Field>
      <Field label="T-1 day reminder">
        <Toggle checked={t1} onChange={setT1} disabled={!emailMaster} />
      </Field>
      <Field label="T+0 unlock notification">
        <Toggle checked={t0} onChange={setT0} disabled={!emailMaster} />
      </Field>
      <Field label="Weekly digest">
        <Toggle checked={digest} onChange={setDigest} disabled={!emailMaster} />
      </Field>
      <Field label="Co-author invitations" hint="When someone invites you to a shared capsule.">
        <Toggle checked={invites} onChange={setInvites} disabled={!emailMaster} />
      </Field>
      <Field label="Reactions & replies" hint="On unlocked public capsules.">
        <Toggle checked={reactions} onChange={setReactions} disabled={!emailMaster} />
      </Field>
      <Field label="Product updates" hint="Major releases only. No marketing.">
        <Toggle checked={product} onChange={setProduct} disabled={!emailMaster} />
      </Field>

      <Field label="Browser push notifications">
        <Toggle checked={push} onChange={setPush} />
      </Field>

      <Field label="Quiet hours" hint="Mute notifications during a daily window.">
        <div className="flex items-center gap-3">
          <Toggle checked={quietHours} onChange={setQuietHours} />
          {quietHours && (
            <span className="font-mono text-sm text-ink-muted">
              22:00 → 08:00
            </span>
          )}
        </div>
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save</button>
      </div>
    </SettingsSection>
  );
}
