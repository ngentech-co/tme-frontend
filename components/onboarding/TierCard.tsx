'use client';

import clsx from 'clsx';

interface TierDef {
  id: string;
  label: string;
  tagline: string;
  privacyMeter?: number;
  recommended?: boolean;
}

interface Props {
  tier: TierDef;
  features: string[];
  tagline?: string;
  recommended?: boolean;
  busy?: boolean;
  onPick: () => void;
}

export default function TierCard({ tier, features, tagline, recommended, busy, onPick }: Props) {
  return (
    <button
      onClick={onPick}
      disabled={busy}
      className={clsx(
        'group relative text-left rounded-card p-8 lg:p-10 transition-all duration-300',
        'border bg-paper border-border-subtle',
        'hover:shadow-paper-lg hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-seal',
        recommended && 'border-seal shadow-paper'
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 bg-seal text-cream text-xs font-medium px-3 py-1 rounded-full">
          recommended
        </span>
      )}

      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="display-sm">{tier.label}</h3>
          {tier.privacyMeter !== undefined && (
            <PrivacyMeter level={tier.privacyMeter} />
          )}
        </div>
        <p className="body text-ink-muted">{tagline ?? tier.tagline}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 body-sm">
            <span className="text-seal mt-1 flex-shrink-0">·</span>
            <span className="text-ink">{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="mono">
          {busy ? 'setting up…' : `choose ${tier.label.toLowerCase()}`}
        </span>
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </button>
  );
}

function PrivacyMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-label={`Privacy level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={clsx(
            'w-1.5 h-4 rounded-sm transition-colors',
            i <= level ? 'bg-seal' : 'bg-border-strong'
          )}
        />
      ))}
    </div>
  );
}
