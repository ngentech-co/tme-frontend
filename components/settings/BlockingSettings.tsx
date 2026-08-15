'use client';

import SettingsSection from './SettingsSection';

export default function BlockingSettings() {
  return (
    <SettingsSection
      title="Blocking & reports"
      description="Manage who can interact with you and review past reports."
    >
      <div className="space-y-6">
        <div>
          <h3 className="heading-md mb-4">Blocked users</h3>
          <p className="body-sm text-ink-muted mb-4">
            Blocked users can't see your public capsules or contact you.
          </p>
          <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
            <p className="body text-ink-soft">No blocked users.</p>
          </div>
        </div>

        <div>
          <h3 className="heading-md mb-4">Muted tags</h3>
          <p className="body-sm text-ink-muted mb-4">
            Tags you've muted won't appear in /explore.
          </p>
          <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
            <p className="body text-ink-soft">No muted tags.</p>
          </div>
        </div>

        <div>
          <h3 className="heading-md mb-4">Report history</h3>
          <p className="body-sm text-ink-muted mb-4">
            Reports you've submitted and their current status.
          </p>
          <div className="bg-cream border border-border-subtle rounded-paper p-6 text-center">
            <p className="body text-ink-soft">No reports submitted.</p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
