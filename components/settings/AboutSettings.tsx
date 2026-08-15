'use client';

import Link from 'next/link';
import SettingsSection from './SettingsSection';
import { SITE } from '@/lib/constants';

export default function AboutSettings() {
  return (
    <SettingsSection
      title="About"
      description="Version info, credits, and how to get help."
    >
      <div className="space-y-6">
        <div>
          <h3 className="heading-md mb-3">Version</h3>
          <p className="font-mono text-body">v0.2.0 · Phase 1</p>
        </div>

        <div>
          <h3 className="heading-md mb-3">Credits</h3>
          <p className="body text-ink-muted">
            Built on the shoulders of: Next.js, Supabase, Cloudflare, Drand,
            Tailwind, and the open-source cryptography community.
          </p>
        </div>

        <div>
          <h3 className="heading-md mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><Link href="/changelog" className="btn-link text-sm">Changelog →</Link></li>
            <li><Link href="/roadmap" className="btn-link text-sm">Roadmap →</Link></li>
            <li><Link href="/security" className="btn-link text-sm">Security explainer →</Link></li>
            <li><Link href="/how-it-works" className="btn-link text-sm">How it works →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="heading-md mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href={`mailto:${SITE.email}`} className="btn-link text-sm">General: {SITE.email}</a></li>
            <li><a href="mailto:security@tomorrowme.net" className="btn-link text-sm">Security disclosure →</a></li>
            <li><Link href="/contact" className="btn-link text-sm">Contact form →</Link></li>
          </ul>
        </div>
      </div>
    </SettingsSection>
  );
}
