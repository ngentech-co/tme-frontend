'use client';

import Link from 'next/link';
import SettingsSection from './SettingsSection';

export default function LegalSettings() {
  return (
    <SettingsSection
      title="Legal"
      description="Agreements, cryptographic proofs, and audit trail."
    >
      <div className="space-y-6">
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
          <h3 className="heading-md mb-3">Cryptographic proofs</h3>
          <p className="body-sm text-ink-muted mb-3">
            Stellar anchoring transactions on your sealed capsules (when enabled).
          </p>
          <button className="btn-ghost text-sm py-2 px-5" disabled>
            No anchoring transactions yet
          </button>
        </div>

        <div>
          <h3 className="heading-md mb-3">Audit trail</h3>
          <p className="body-sm text-ink-muted mb-3">
            Every action on your account, with timestamps.
          </p>
          <button className="btn-link text-sm">
            View account log →
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
