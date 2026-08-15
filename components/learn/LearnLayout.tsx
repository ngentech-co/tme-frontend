import type { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  related: Array<{ href: string; label: string }>;
}

export default function LearnLayout({ eyebrow, title, intro, children, related }: Props) {
  return (
    <main className="container-page py-24 sm:py-32">
      <div className="max-w-prose mx-auto">
        <Link href="/learn" className="mono text-ink-muted hover:text-ink mb-10 inline-block">
          ← learn
        </Link>
        <p className="mono mb-3">{eyebrow}</p>
        <h1 className="display-lg mb-8 text-balance">{title}</h1>
        <p className="body-lg text-ink-muted mb-16">{intro}</p>

        <div className="reading-prose">{children}</div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="display-sm mb-6">Keep reading</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="card-paper p-6 hover:shadow-paper-lg transition-all">
                  <span className="body">{r.label} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 card-paper p-10 text-center">
          <p className="display-sm mb-6">Ready to seal something?</p>
          <Link href="/seal" className="btn-primary text-base">
            Seal a capsule
          </Link>
        </div>
      </div>
    </main>
  );
}
