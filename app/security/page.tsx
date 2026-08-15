import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, techArticleSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How tomorrowme uses AES-256, Drand BLS threshold cryptography, and BIP-39 recovery to keep your capsules sealed until the exact moment you choose.',
};

export default function SecurityPage() {
  const ld = techArticleSchema({
    title: 'How tomorrowme secures your capsules',
    description: 'A complete technical walk-through of the cryptography and threat model.',
    url: 'https://ure.one/security',
  });

  return (
    <>
      <JsonLd data={ld} />
      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">security</p>
          <h1 className="display-lg mb-10 text-balance">
            The threat model and the cryptography.
          </h1>

          <p className="body-lg text-ink-muted mb-12">
            We assume tomorrowme is hostile. We assume our servers are seized.
            We assume our employees can be compelled. The only thing we trust
            is math. Here's the math.
          </p>

          <hr className="ink-rule my-12" />

          <h2 className="display-sm mb-6">The primitives</h2>
          <div className="card-paper p-8 mb-10">
            <table className="w-full body">
              <tbody>
                <Row label="Symmetric encryption" value="AES-256-GCM" />
                <Row label="Key derivation" value="PBKDF2 (SHA-256, 210k iterations)" />
                <Row label="Time-lock primitive" value="Drand BLS threshold (identity-based encryption)" />
                <Row label="Recovery format" value="BIP-39 24-word mnemonic" />
                <Row label="Random source" value="crypto.getRandomValues() (CSPRNG)" />
                <Row label="Hashing" value="SHA-256, RIPEMD-160 (BIP-39)" />
                <Row label="Anchoring (invisible)" value="Stellar ledger (planned Phase 4)" />
              </tbody>
            </table>
          </div>

          <h2 className="display-sm mb-6">Sealing pipeline</h2>
          <div className="reading-prose">
            <p>
              When you submit a capsule:
            </p>
            <ol className="space-y-2 list-decimal pl-6 mb-8 body-lg text-ink">
              <li>A fresh AES-256 key <span className="mono">K</span> is generated.</li>
              <li>Your content (text + media) is encrypted with <span className="mono">K</span> using AES-GCM, producing ciphertext <span className="mono">C</span>.</li>
              <li>The target unlock round <span className="mono">R</span> is computed from your chosen date and Drand's chain parameters (genesis time + period).</li>
              <li><span className="mono">K</span> is encrypted under Drand's BLS identity-based scheme against round <span className="mono">R</span>, producing temporal ciphertext <span className="mono">T</span>.</li>
              <li>The server stores only <span className="mono">C</span> and <span className="mono">T</span>. Without Drand's round <span className="mono">R</span> signature, <span className="mono">K</span> cannot be recovered.</li>
            </ol>
            <p>
              No party — including tomorrowme — can decrypt <span className="mono">C</span> before round <span className="mono">R</span> is published by the Drand network.
            </p>
          </div>

          <h2 className="display-sm mt-16 mb-6">What we don't do</h2>
          <ul className="space-y-3 body-lg text-ink mb-8">
            <li className="flex gap-3"><span className="text-seal">·</span>We never see your plaintext content. The encryption happens in your browser.</li>
            <li className="flex gap-3"><span className="text-seal">·</span>We never see your AES keys. They never leave your device.</li>
            <li className="flex gap-3"><span className="text-seal">·</span>We never see your recovery phrase. It's generated locally and never transmitted.</li>
            <li className="flex gap-3"><span className="text-seal">·</span>We have no "master key" or escrow that can bypass the time-lock.</li>
            <li className="flex gap-3"><span className="text-seal">·</span>We don't store your IP address (anonymized-hash only).</li>
          </ul>

          <h2 className="display-sm mt-16 mb-6">What we do</h2>
          <ul className="space-y-3 body-lg text-ink mb-8">
            <li className="flex gap-3"><span className="text-seal">·</span>Store opaque ciphertext blobs (Supabase Storage + Cloudflare R2).</li>
            <li className="flex gap-3"><span className="text-seal">·</span>Compute Drand rounds from your chosen unlock dates.</li>
            <li className="flex gap-3"><span className="text-seal">·</span>Send reminder emails at T-7, T-1, and T+0 (opt-out anytime).</li>
            <li className="flex gap-3"><span className="text-seal">·</span>Run a backup infrastructure on Cloudflare's edge network.</li>
          </ul>

          <h2 className="display-sm mt-16 mb-6">Threat model</h2>
          <div className="card-paper p-8 mb-10 overflow-x-auto">
            <table className="w-full body-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 font-medium">Threat</th>
                  <th className="text-left py-3 font-medium">Protection</th>
                </tr>
              </thead>
              <tbody className="text-ink-muted">
                <ThreatRow threat="Server breach" protection="Opaque ciphertext only. No plaintext stored anywhere." />
                <ThreatRow threat="Insider access" protection="AES key never leaves client. Insider cannot decrypt." />
                <ThreatRow threat="Subpoena / court order" protection="We cannot produce what we don't have." />
                <ThreatRow threat="Company shutdown" protection="Recovery key + bookmark URL restores access from any device." />
                <ThreatRow threat="Network seizure" protection="Drand is decentralized across 16 orgs globally." />
                <ThreatRow threat="Recovery key loss" protection="Documented as user-bearable risk; same as losing a hardware wallet." />
                <ThreatRow threat="Browser compromise" protection="Use a trusted device; consider passkey tier for maximum isolation." />
              </tbody>
            </table>
          </div>

          <h2 className="display-sm mt-16 mb-6">Source-availability commitment</h2>
          <div className="reading-prose">
            <p>
              The client-side cryptography in tomorrowme is small enough to audit in an
              afternoon. We publish the encryption pipeline as part of every release so
              independent reviewers can verify the implementation matches this document.
            </p>
            <p>
              Discrepancies between this page and the code are bugs. Please{' '}
              <Link href="/contact" className="underline decoration-seal/30 underline-offset-4 hover:decoration-seal">report them</Link>.
            </p>
          </div>

          <div className="mt-20 card-paper p-10 text-center">
            <p className="mono mb-4">disclosure</p>
            <p className="body text-ink-muted mb-6">
              Found a vulnerability? We'd love to hear about it.
            </p>
            <a href="mailto:security@tomorrowme.net" className="btn-ghost">
              security@tomorrowme.net
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border-subtle last:border-b-0">
      <td className="py-4 text-ink-muted">{label}</td>
      <td className="py-4 font-mono text-right">{value}</td>
    </tr>
  );
}

function ThreatRow({ threat, protection }: { threat: string; protection: string }) {
  return (
    <tr className="border-b border-border-subtle last:border-b-0">
      <td className="py-4 pr-6 font-medium text-ink">{threat}</td>
      <td className="py-4">{protection}</td>
    </tr>
  );
}
