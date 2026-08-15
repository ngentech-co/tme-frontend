'use client';

import SettingsSection, { Field, Toggle } from './SettingsSection';
import TwoFactorSetup from './TwoFactorSetup';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/use-settings';

export default function SecuritySettings() {
  const { user } = useAuth();
  const { settings: s, update } = useSettings();

  const isEmailTier = user?.tier === 'email';

  return (
    <SettingsSection
      title="Security"
      description="Two-factor auth, sessions, and cryptographic preferences. Changes save automatically."
    >
      <Field
        label="Two-factor authentication"
        hint={isEmailTier ? 'TOTP authenticator app. Email-tier accounts only.' : 'Email-tier accounts only.'}
      >
        {isEmailTier ? (
          <div className="w-full max-w-2xl">
            <TwoFactorSetup />
          </div>
        ) : (
          <span className="mono text-xs text-ink-soft">email tier only</span>
        )}
      </Field>

      <Field label="Active sessions" hint="Devices currently signed in.">
        <span className="mono text-xs text-ink-soft">this device</span>
      </Field>

      <Field label="Encryption preferences" hint="Standard depth is recommended.">
        <select
          value={s.verificationDepth}
          onChange={(e) => update({ verificationDepth: e.target.value as 'standard' | 'paranoid' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="standard">Standard</option>
          <option value="paranoid">Paranoid (more rounds of derivation)</option>
        </select>
      </Field>

      <Field
        label="Anchor seals on Stellar (invisible)"
        hint="Writes a tamper-proof timestamp to the Stellar ledger. No Stellar wallet needed."
      >
        <Toggle checked={s.anchorOnStellar} onChange={(v) => update({ anchorOnStellar: v })} />
      </Field>

      <Field
        label="Self-destruct on inactivity"
        hint="Delete account + all capsules after a period of inactivity."
      >
        <select
          value={s.inactivityWipe}
          onChange={(e) => update({ inactivityWipe: e.target.value as 'never' | '6m' | '1y' | '2y' })}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="never">Never</option>
          <option value="6m">After 6 months</option>
          <option value="1y">After 1 year</option>
          <option value="2y">After 2 years</option>
        </select>
      </Field>

      <p className="mono text-ink-soft mt-8">saved automatically</p>
    </SettingsSection>
  );
}
