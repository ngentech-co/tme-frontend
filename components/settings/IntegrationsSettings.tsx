'use client';

import SettingsSection from './SettingsSection';

export default function IntegrationsSettings() {
  return (
    <SettingsSection
      title="Integrations"
      description="Connect third-party apps, set up webhooks, manage API tokens."
    >
      <div className="space-y-6">
        <div className="p-6 bg-cream border border-border-subtle rounded-paper">
          <p className="mono mb-2 text-ink-muted">third-party apps</p>
          <p className="body text-ink-muted mb-3">
            Connect apps like Zapier, IFTTT, or Make to automate unlock reactions.
          </p>
          <button className="btn-ghost text-sm py-2 px-5" disabled>
            Coming in Phase 3
          </button>
        </div>

        <div className="p-6 bg-cream border border-border-subtle rounded-paper">
          <p className="mono mb-2 text-ink-muted">webhooks</p>
          <p className="body text-ink-muted mb-3">
            Receive an HTTP POST when a capsule unlocks.
          </p>
          <button className="btn-ghost text-sm py-2 px-5" disabled>
            Coming in Phase 3
          </button>
        </div>

        <div className="p-6 bg-cream border border-border-subtle rounded-paper">
          <p className="mono mb-2 text-ink-muted">api tokens</p>
          <p className="body text-ink-muted mb-3">
            Personal access tokens for the tomorrowme CLI and scripts.
          </p>
          <button className="btn-ghost text-sm py-2 px-5" disabled>
            Coming in Phase 3
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
