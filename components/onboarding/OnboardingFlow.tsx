'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { TIERS } from '@/lib/constants';
import TierCard from '@/components/onboarding/TierCard';
import EmailSetup from '@/components/onboarding/EmailSetup';
import PasskeySetup from '@/components/onboarding/PasskeySetup';
import RecoveryKeyGate from '@/components/onboarding/RecoveryKeyGate';
import { SITE } from '@/lib/constants';

type Step = 'choose' | 'setup' | 'recovery';

export default function OnboardingFlow() {
  const router = useRouter();
  const { signInEmail, signInAnonymous, signOut, user } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [chosen, setChosen] = useState<'anonymous' | 'email' | 'passkey' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (tier: 'anonymous' | 'email' | 'passkey') => {
    setChosen(tier);
    setError(null);
    if (tier === 'anonymous') {
      setBusy(true);
      const result = await signInAnonymous();
      setBusy(false);
      if (!result.ok) {
        setError(result.error ?? 'Could not start anonymous account.');
        return;
      }
      setStep('recovery');
    } else {
      setStep('setup');
    }
  };

  const onSetupComplete = () => {
    setStep('recovery');
  };

  const onRecoveryConfirmed = () => {
    router.push('/inbox');
  };

  if (user && !chosen) {
    return (
      <div className="max-w-reading mx-auto text-center">
        <h1 className="display-md mb-6">You're already signed in.</h1>
        <p className="body-lg text-ink-muted mb-10">
          You're currently using a <strong>{user.tier}</strong> account on this device.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/inbox" className="btn-primary">
            Go to inbox
          </Link>
          <button onClick={signOut} className="btn-ghost">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      {step === 'choose' && (
        <div>
          <div className="max-w-prose mx-auto text-center mb-16">
            <p className="mono mb-6">welcome</p>
            <h1 className="display-md mb-6 text-balance">
              How do you want to be known?
            </h1>
            <p className="body-lg text-ink-muted">
              Pick the account type that fits how you want to seal your future messages.
              You can switch any time from Settings.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-wide mx-auto">
            <TierCard
              tier={TIERS.anonymous}
              features={[
                'No email needed',
                'Self-custody recovery key',
                'No public profile',
                'No social features',
              ]}
              onPick={() => pick('anonymous')}
              busy={busy && chosen === 'anonymous'}
            />
            <TierCard
              tier={TIERS.email}
              recommended
              features={[
                'Magic-link sign in',
                'Optional public profile',
                'Share capsules publicly',
                'Discoverable in Explore',
              ]}
              onPick={() => pick('email')}
              busy={busy && chosen === 'email'}
            />
            <TierCard
              tier={TIERS.passkey}
              features={[
                'WebAuthn passkey only',
                'No email, no profile',
                'Maximum privacy',
                'Strict self-custody',
              ]}
              onPick={() => pick('passkey')}
              busy={busy && chosen === 'passkey'}
            />
          </div>

          <p className="text-center mt-12 body-sm text-ink-soft">
            Free forever · no credit card · {SITE.name}
          </p>

          {error && (
            <p className="mt-8 text-center body text-seal" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {step === 'setup' && chosen === 'email' && (
        <EmailSetup
          onComplete={onSetupComplete}
          onBack={() => setStep('choose')}
          signInEmail={signInEmail}
        />
      )}

      {step === 'setup' && chosen === 'passkey' && (
        <PasskeySetup
          onComplete={onSetupComplete}
          onBack={() => setStep('choose')}
        />
      )}

      {step === 'recovery' && (
        <RecoveryKeyGate
          onConfirmed={onRecoveryConfirmed}
          onBack={chosen === 'anonymous' ? () => setStep('choose') : () => setStep('setup')}
        />
      )}
    </div>
  );
}
