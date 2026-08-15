'use client';

import { useEffect, useState } from 'react';

interface Props {
  to: Date;
  className?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function compute(to: Date): Remaining {
  const total = Math.max(0, to.getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}

export default function CountdownInline({ to, className = '' }: Props) {
  const [r, setR] = useState<Remaining | null>(null);

  useEffect(() => {
    setR(compute(to));
    const i = setInterval(() => setR(compute(to)), 1000);
    return () => clearInterval(i);
  }, [to]);

  if (!r) {
    return <span className={`mono text-ink-soft ${className}`}>…</span>;
  }

  if (r.total === 0) {
    return <span className={`mono text-seal ${className}`}>ready to open</span>;
  }

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`flex items-center gap-3 mono text-ink ${className}`}>
      <Segment value={r.days} label="d" />
      <span className="text-ink-soft">:</span>
      <Segment value={r.hours} label="h" pad2 />
      <span className="text-ink-soft">:</span>
      <Segment value={r.minutes} label="m" pad2 />
      <span className="text-ink-soft">:</span>
      <Segment value={r.seconds} label="s" pad2 />
    </div>
  );
}

function Segment({
  value,
  label,
  pad2,
}: {
  value: number;
  label: string;
  pad2?: boolean;
}) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className={`${pad2 ? 'tabular-nums' : ''} font-medium`}>
        {pad2 ? value.toString().padStart(2, '0') : value}
      </span>
      <span className="text-ink-soft text-xs">{label}</span>
    </span>
  );
}
