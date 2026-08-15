'use client';

import { useState } from 'react';
import SettingsSection, { Field, Toggle } from './SettingsSection';
import TwoFactorSetup from './TwoFactorSetup';
import { useAuth } from '@/lib/auth-context';

export default function SecuritySettings() {
  const { user } = useAuth();
  const [anchoring, setAnchoring] = useState(true);
  const [verificationDepth, setVerificationDepth] = useState('standard');
  const [inactivityWipe, setInactivityWipe] = useState('never');

  const isEmailTier = user?.tier === 'email';

  return (
    <SettingsSection
      title="Security"
      description="Two-factor auth, sessions, and cryptographic preferences."
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
        <button className="btn-ghost text-sm py-2 px-5">Manage sessions</button>
      </Field>

      <Field label="Login history" hint="Last 50 sign-ins.">
        <button className="btn-link text-sm">View log</button>
      </Field>

      <Field label="Encryption preferences" hint="Standard depth is recommended.">
        <select
          value={verificationDepth}
          onChange={(e) => setVerificationDepth(e.target.value)}
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
        <Toggle checked={anchoring} onChange={setAnchoring} />
      </Field>

      <Field
        label="Self-destruct on inactivity"
        hint="Delete account + all capsules after a period of inactivity."
      >
        <select
          value={inactivityWipe}
          onChange={(e) => setInactivityWipe(e.target.value)}
          className="bg-cream border border-border-subtle rounded-paper px-4 py-2 body-sm"
        >
          <option value="never">Never</option>
          <option value="6m">After 6 months</option>
          <option value="1y">After 1 year</option>
          <option value="2y">After 2 years</option>
        </select>
      </Field>

      <div className="mt-10 flex justify-end">
        <button className="btn-primary text-sm py-2.5 px-6">Save</button>
      </div>
    </SettingsSection>
  );
}
