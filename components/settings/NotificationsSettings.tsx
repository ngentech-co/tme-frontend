'use client';

import SettingsSection, { Field, Toggle } from './SettingsSection';
import { useSettings } from '@/lib/use-settings';

export default function NotificationsSettings() {
  const { settings: s, update } = useSettings();

  return (
    <SettingsSection
      title="Notifications"
      description="What we tell you, and when. Changes save automatically."
    >
      <Field label="Email notifications" hint="Master switch for all email.">
        <Toggle checked={s.emailMaster} onChange={(v) => update({ emailMaster: v })} />
      </Field>

      <Field label="T-30 days reminder">
        <Toggle checked={s.t30} onChange={(v) => update({ t30: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="T-7 days reminder">
        <Toggle checked={s.t7} onChange={(v) => update({ t7: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="T-1 day reminder">
        <Toggle checked={s.t1} onChange={(v) => update({ t1: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="T+0 unlock notification">
        <Toggle checked={s.t0} onChange={(v) => update({ t0: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="Weekly digest">
        <Toggle checked={s.digest} onChange={(v) => update({ digest: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="Co-author invitations" hint="When someone invites you to a shared capsule.">
        <Toggle checked={s.invites} onChange={(v) => update({ invites: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="Reactions & replies" hint="On unlocked public capsules.">
        <Toggle checked={s.reactions} onChange={(v) => update({ reactions: v })} disabled={!s.emailMaster} />
      </Field>
      <Field label="Product updates" hint="Major releases only. No marketing.">
        <Toggle checked={s.product} onChange={(v) => update({ product: v })} disabled={!s.emailMaster} />
      </Field>

      <Field label="Browser push notifications">
        <Toggle checked={s.push} onChange={(v) => update({ push: v })} />
      </Field>

      <Field label="Quiet hours" hint="Mute notifications during a daily window.">
        <div className="flex items-center gap-3">
          <Toggle checked={s.quietHours} onChange={(v) => update({ quietHours: v })} />
          {s.quietHours && <span className="font-mono text-sm text-ink-muted">22:00 → 08:00</span>}
        </div>
      </Field>

      <p className="mono text-ink-soft mt-8">saved automatically</p>
    </SettingsSection>
  );
}
