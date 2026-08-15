'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import SettingsSection from './SettingsSection';
import {
  listAnchorsForUser,
  anchorExplorerUrl,
  getStellarSecret,
  setStellarSecret,
  clearStellarSecret,
  isStellarConfigured,
  type StellarAnchor,
} from '@/lib/stellar/anchor';
import { backendListAudit } from '@/lib/backend';

export default function LegalSettings() {
  const { user } = useAuth();
  const [anchors, setAnchors] = useState<StellarAnchor[]>([]);
  const [audit, setAudit] = useState<import('@/lib/audit').AuditEntry[]>([]);
  const [secretInput, setSecretInput] = useState('');
  const [configured, setConfigured] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setAnchors(listAnchorsForUser(user.id));
    backendListAudit(user.id).then(setAudit);
    setConfigured(isStellarConfigured());
  }, [user]);

  const onSaveSecret = () => {
    if (!secretInput.trim()) return;
    setStellarSecret(secretInput.trim());
    setConfigured(true);
    setSecretInput('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onClearSecret = () => {
    clearStellarSecret();
    setConfigured(false);
  };

  return (
    <SettingsSection
      title="Legal"
      description="Agreements, cryptographic proofs, and audit trail."
    >
      <div className="space-y-8">
        <div>
          <h3 className="heading-md mb-3">Agreements</h3>
          <ul className="space-y-2">
            <li><Link href="/terms" className="btn-link text-sm">Terms of service →</Link></li>
            <li><Link href="/privacy" className="btn-link text-sm">Privacy policy →</Link></li>
            <li><Link href="/cookies" className="btn-link text-sm">Cookie policy →</Link></li>
            <li><Link href="/acceptable-use" className="btn-link text-sm">Acceptable use →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="heading-md mb-3">Stellar anchoring (invisible)</h3>
          <p className="body-sm text-ink-muted mb-4">
            Each sealed capsule gets a tamper-proof content hash. When a Stellar
            secret key is configured below, that hash is written to the Stellar
            ledger as an invisible memo — verifiable on-chain, with no wallet UI
            anywhere in the product. Without a secret, anchors are recorded as
            <em> simulated</em> (deterministic, locally verifiable).
          </p>

          {configured ? (
            <div className="mb-4 flex items-center gap-3">
              <span className="mono text-xs px-3 py-1 rounded-full bg-seal/10 text-seal">
                configured
              </span>
              <button onClick={onClearSecret} className="btn-link text-sm">
                Remove secret key
              </button>
            </div>
          ) : (
            <div className="mb-4 max-w-md">
              <label className="block mono mb-2 text-xs">stellar secret key (optional)</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="S… secret key (optional)"
                  className="flex-1 bg-cream border border-border-subtle rounded-paper px-4 py-2 font-mono text-sm focus:border-seal focus:outline-none"
                />
                <button onClick={onSaveSecret} className="btn-ghost text-sm py-2 px-5">
                  Save
                </button>
              </div>
              {saved && <p className="mono text-xs text-seal mt-2">saved ✓</p>}
            </div>
          )}

          {anchors.length === 0 ? (
            <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
              <p className="body text-ink-soft">
                No anchoring records yet. Seal a capsule to generate one.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {anchors.map((a) => {
                const url = anchorExplorerUrl(a);
                return (
                  <li key={a.id} className="py-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <p className="mono text-xs text-ink-soft mb-1">
                          capsule {a.capsuleId.slice(0, 8)}…
                        </p>
                        <p className="font-mono text-sm truncate">{a.contentHash.slice(0, 24)}…</p>
                        <p className="mono text-xs text-ink-soft mt-1">
                          round {a.drandRound} · {new Date(a.createdAt).toLocaleDateString()}
                          {a.revealedAt && ' · revealed'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`mono text-xs px-3 py-1 rounded-full ${
                            a.status === 'on-chain'
                              ? 'bg-seal/10 text-seal'
                              : a.status === 'revealed'
                              ? 'bg-wax-gold/20 text-wax-dark'
                              : 'bg-border-subtle text-ink-muted'
                          }`}
                        >
                          {a.status}
                        </span>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-link text-sm"
                          >
                            View on Stellar Expert ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <h3 className="heading-md mb-3">Audit trail</h3>
          <p className="body-sm text-ink-muted mb-3">
            Recent actions on your account, with timestamps.
          </p>
          {audit.length === 0 ? (
            <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
              <p className="body text-ink-soft">
                No actions recorded yet. Seal or open a capsule to populate this log.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {audit.map((e) => (
                <li key={e.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-sm">{e.action}</p>
                    {e.detail && (
                      <p className="mono text-xs text-ink-soft truncate">{e.detail}</p>
                    )}
                  </div>
                  <span className="mono text-xs text-ink-soft flex-shrink-0">
                    {new Date(e.createdAt).toLocaleString('en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
