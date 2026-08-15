'use client';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsSection({ title, description, children }: Props) {
  return (
    <div>
      <p className="mono mb-3 md:mb-4">settings</p>
      <h1 className="display-md mb-3 md:mb-4 text-balance">{title}</h1>
      {description && (
        <p className="body-lg text-ink-muted mb-6 md:mb-10">{description}</p>
      )}
      <div className="card-paper p-4 sm:p-6 md:p-8 lg:p-10">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="border-b border-border-subtle last:border-b-0 py-5 md:py-6 first:pt-0 last:pb-0">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex-1 md:min-w-[200px] mb-3 md:mb-0">
          <p className="body font-medium mb-1">{label}</p>
          {hint && <p className="body-sm text-ink-muted">{hint}</p>}
        </div>
        <div className="flex-shrink-0 md:pt-0.5">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? 'bg-seal' : 'bg-border-strong'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-cream rounded-full transition-transform shadow-paper ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}
