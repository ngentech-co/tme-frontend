'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { TierId } from '@/lib/constants';
import { listCapsules, updateCapsuleVisibility } from '@/lib/storage/capsules';

interface TierSwitchWarning {
  title: string;
  consequences: string[];
  confirmLabel: string;
}

/**
 * Full tier switcher with per-transition consequence modals.
 * Adjusts existing capsule visibility on downgrades.
 */
export default function TierSwitcher() {
  const router = useRouter();
  const { user, switchTier } = useAuth();
  const [target, setTarget] = useState<TierId | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const warning = useMemo<TierSwitchWarning | null>(() => {
    if (!user || !target || target === user.tier) return null;

    const from = user.tier;
    const publicCount = listCapsules(user.id).filter((c) => c.visibility === 'public').length;

    const warnings: Record<string, TierSwitchWarning> = {
      'email->passkey': {
        title: 'Upgrade to a passkey account?',
        consequences: [
          publicCount > 0
            ? `${publicCount} public capsule${publicCount === 1 ? '' : 's'} will be made private.`
            : 'All capsules will remain private.',
          'Your public profile will be hidden.',
          'Social features (sharing, comments, reactions) will be disabled.',
          'Passkey sign-in becomes your primary method.',
        ],
        confirmLabel: 'Switch to passkey',
      },
      'email->anonymous': {
        title: 'Downgrade to an anonymous account?',
        consequences: [
          publicCount > 0
            ? `${publicCount} public capsule${publicCount === 1 ? '' : 's'} will be made private.`
            : 'All capsules will remain private.',
          'Your public profile will be deleted.',
          'Your email will no longer be used for sign-in.',
          'You will need your recovery key (or bookmark URL) to sign in.',
        ],
        confirmLabel: 'Switch to anonymous',
      },
      'passkey->email': {
        title: 'Downgrade to an email account?',
        consequences: [
          'You will need to provide an email address to continue.',
          'You may re-enable public capsules and social features.',
          'Passkey sign-in remains available as an option.',
        ],
        confirmLabel: 'Switch to email',
      },
      'passkey->anonymous': {
        title: 'Downgrade to an anonymous account?',
        consequences: [
          'Your passkey will no longer be the primary sign-in.',
          'Recovery key becomes your only sign-in method.',
          'All capsules remain private.',
        ],
        confirmLabel: 'Switch to anonymous',
      },
      'anonymous->email': {
        title: 'Upgrade to an email account?',
        consequences: [
          'You can share capsules publicly and use social features.',
          'Existing capsules stay private until you change them.',
          'Email becomes an additional sign-in method.',
        ],
        confirmLabel: 'Switch to email',
      },
      'anonymous->passkey': {
        title: 'Upgrade to a passkey account?',
        consequences: [
          'Passkey becomes your primary sign-in.',
          'Capsules stay private by default.',
          'Maximum privacy with device-bound credentials.',
        ],
        confirmLabel: 'Switch to passkey',
      },
    };

    return warnings[`${from}->${target}`] ?? null;
  }, [user, target]);

  const doSwitch = async () => {
    if (!user || !target) return;
    setBusy(true);
    setError(null);

    try {
      // On downgrades to private tiers, flip public capsules to private.
      if ((target === 'anonymous' || target === 'passkey') && user.tier === 'email') {
        for (const c of listCapsules(user.id)) {
          if (c.visibility === 'public' || c.visibility === 'unlisted') {
            updateCapsuleVisibility(user.id, c.id, 'private');
          }
        }
      }

      const r = await switchTier(target);
      if (!r.ok) {
        setError(r.error ?? 'Could not switch tier.');
      }
    } finally {
      setBusy(false);
      setTarget(null);
      router.refresh();
    }
  };

  if (!user) return null;

  const tiers: Array<{ id: TierId; label: string; blurb: string }> = [
    { id: 'anonymous', label: 'Anonymous', blurb: 'No trace' },
    { id: 'email', label: 'Email', blurb: 'Connect & share' },
    { id: 'passkey', label: 'Passkey', blurb: 'Max privacy' },
  ];

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {tiers.map((t) => (
          <button
            key={t.id}
            onClick={() => setTarget(t.id)}
            disabled={user.tier === t.id || busy}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              user.tier === t.id
                ? 'border-border-subtle text-ink-soft cursor-default'
                : 'border-seal text-seal hover:bg-seal hover:text-cream'
            }`}
          >
            {t.id === user.tier ? `${t.label} ✓` : t.label}
          </button>
        ))}
      </div>

      {warning && target && (
        <div className="mt-6 p-6 border border-seal rounded-paper bg-seal/5">
          <h3 className="heading-md mb-3">{warning.title}</h3>
          <ul className="space-y-2 mb-6">
            {warning.consequences.map((c) => (
              <li key={c} className="flex gap-3 body-sm">
                <span className="text-seal flex-shrink-0">·</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          {error && (
            <p className="mb-4 body-sm text-seal" role="alert">{error}</p>
          )}
          <div className="flex gap-3">
            <button onClick={doSwitch} disabled={busy} className="btn-primary text-sm py-2 px-6">
              {busy ? 'Switching…' : warning.confirmLabel}
            </button>
            <button onClick={() => setTarget(null)} className="btn-link text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
