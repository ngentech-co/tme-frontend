'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createCapsule } from '@/lib/storage/capsules';
import { generateRecoveryKey } from '@/lib/recovery';
import { STORAGE } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

type Step = 'compose' | 'date' | 'preview' | 'sealing' | 'done';

interface ImageAsset {
  name: string;
  dataUrl: string;
  sizeBytes: number;
}

const STEP_LABELS: Record<Step, string> = {
  compose: 'compose',
  date: 'unlock date',
  preview: 'preview',
  sealing: 'sealing',
  done: 'sealed',
};

export default function SealWizard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState<Step>('compose');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [unlockAt, setUnlockAt] = useState<Date>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d;
  });
  const [visibility, setVisibility] = useState<'private' | 'unlisted' | 'public'>('private');
  const [sealedId, setSealedId] = useState<string | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setNeedsAuth(true);
    }
  }, [loading, user]);

  if (needsAuth || (loading && !user)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-reading text-center">
          <span className="seal-stamp mx-auto mb-8 inline-flex">seal</span>
          <h1 className="display-md mb-6">Pick how you want to seal.</h1>
          <p className="body-lg text-ink-muted mb-10">
            tomorrowme can encrypt your capsule without an account, but you'll
            need one to retrieve it later. Pick a tier to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/onboarding" className="btn-primary">
              Start onboarding
            </Link>
            <Link href="/auth" className="btn-ghost">
              I already have an account
            </Link>
            <Link href="/" className="btn-link">
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const accepted: ImageAsset[] = [];
    for (const file of files.slice(0, 5)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      const dataUrl = await fileToDataUrl(file);
      accepted.push({ name: file.name, dataUrl, sizeBytes: file.size });
    }
    setImages((prev) => [...prev, ...accepted].slice(0, 5));
  };

  const seal = async () => {
    if (!user) return;
    setStep('sealing');
    setError(null);
    try {
      const stored = await createCapsule({
        userId: user.id,
        title: title || 'A letter to future me',
        text,
        images,
        unlockAt,
        visibility,
        coverColor: 'seal',
      });
      trackEvent('capsule_sealed', {
        tier: user.tier,
        visibility,
        has_images: images.length > 0,
        unlock_horizon_months: Math.round(
          (unlockAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
        ),
      });
      setSealedId(stored.id);
      setShareSlug(stored.shareSlug);
      setStep('done');
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
      setStep('preview');
    }
  };

  if (step === 'done' && sealedId && shareSlug) {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="max-w-reading mx-auto text-center">
          <span className="seal-stamp mx-auto mb-10 inline-flex animate-seal-pulse">✓</span>
          <p className="mono mb-6 text-seal">sealed</p>
          <h1 className="display-md mb-6">It's sealed.</h1>
          <p className="body-lg text-ink-muted mb-10">
            Your capsule will reveal on{' '}
            <strong>{unlockAt.toLocaleDateString('en-US', { dateStyle: 'long' })}</strong>.
            We've saved it to your inbox.
          </p>

          {visibility !== 'private' && (
            <div className="card-paper p-8 mb-8 text-left">
              <p className="mono mb-3">share link</p>
              <div className="flex items-center gap-3 bg-cream border border-border-subtle rounded-paper px-4 py-3">
                <code className="flex-1 font-mono text-sm truncate">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/public/?slug=${shareSlug}`}
                </code>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/public/?slug=${shareSlug}`;
                    navigator.clipboard?.writeText(url);
                  }}
                  className="btn-link text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/inbox" className="btn-primary">
              Go to inbox
            </Link>
            {visibility !== 'private' && (
              <Link href={`/public/?slug=${shareSlug}`} className="btn-ghost">
                View public page
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="max-w-prose mx-auto">
        <Progress step={step} />

        {step === 'compose' && (
          <div>
            <h1 className="display-md mb-4 text-balance">Write to your future self.</h1>
            <p className="body text-ink-muted mb-10">
              Anything. A confession. A song. A promise. A photograph.
            </p>

            <label className="block mono mb-3">title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A letter to future me"
              maxLength={120}
              className="w-full bg-paper border border-border-subtle rounded-paper px-5 py-4 body mb-8 focus:border-seal focus:outline-none"
            />

            <label className="block mono mb-3">message</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dear future me,&#10;&#10;Right now, on this day…"
              rows={14}
              maxLength={50000}
              className="w-full bg-paper border border-border-subtle rounded-paper px-5 py-4 body resize-y focus:border-seal focus:outline-none"
            />
            <div className="flex justify-between items-center mt-3 mb-10">
              <p className="body-sm text-ink-soft">
                Encrypted in your browser before upload.
              </p>
              <p className="mono text-ink-soft">{text.length} chars</p>
            </div>

            <label className="block mono mb-3">images (optional, up to 5)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-paper overflow-hidden border border-border-subtle"
                >
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-ink/80 text-cream rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square rounded-paper border border-dashed border-border-strong flex items-center justify-center cursor-pointer hover:border-seal transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImage}
                    className="sr-only"
                  />
                  <span className="text-2xl text-ink-muted">+</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('date')}
                disabled={!text.trim()}
                className="btn-primary"
              >
                Pick the date →
              </button>
            </div>
          </div>
        )}

        {step === 'date' && (
          <div>
            <h1 className="display-md mb-4 text-balance">When should it open?</h1>
            <p className="body text-ink-muted mb-10">
              Choose the exact moment. We'll seal against a Drand round for that
              timestamp.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: '1 month', months: 1 },
                { label: '6 months', months: 6 },
                { label: '1 year', months: 12 },
                { label: '5 years', months: 60 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const d = new Date();
                    d.setMonth(d.getMonth() + preset.months);
                    setUnlockAt(d);
                  }}
                  className="card-paper p-5 text-left hover:border-seal transition-colors"
                >
                  <p className="mono text-xs mb-1">preset</p>
                  <p className="body font-medium">{preset.label}</p>
                </button>
              ))}
            </div>

            <label className="block mono mb-3">or pick a date</label>
            <input
              type="date"
              value={unlockAt.toISOString().slice(0, 10)}
              onChange={(e) => {
                const d = new Date(e.target.value);
                if (!isNaN(d.getTime())) setUnlockAt(d);
              }}
              min={new Date(Date.now() + 60_000).toISOString().slice(0, 10)}
              className="w-full bg-paper border border-border-subtle rounded-paper px-5 py-4 body mb-8 focus:border-seal focus:outline-none"
            />

            <label className="block mono mb-3">visibility</label>
            <div className="grid sm:grid-cols-3 gap-3 mb-10">
              {([
                { v: 'private', label: 'Private', body: 'Only you. No share link.' },
                { v: 'unlisted', label: 'Unlisted', body: 'Shareable link. Not indexed.' },
                { v: 'public', label: 'Public', body: 'Indexed & discoverable.' },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setVisibility(opt.v)}
                  className={`text-left rounded-card border p-5 transition-colors ${
                    visibility === opt.v
                      ? 'border-seal bg-seal/5'
                      : 'border-border-subtle hover:border-ink-muted'
                  }`}
                >
                  <p className="body font-medium mb-1">{opt.label}</p>
                  <p className="body-sm text-ink-muted">{opt.body}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep('compose')} className="btn-ghost">
                ← Back
              </button>
              <button onClick={() => setStep('preview')} className="btn-primary">
                Preview →
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div>
            <h1 className="display-md mb-4 text-balance">One last look.</h1>
            <p className="body text-ink-muted mb-10">
              Once you seal, this content is encrypted client-side and only
              retrievable on{' '}
              <strong>{unlockAt.toLocaleDateString('en-US', { dateStyle: 'long' })}</strong>.
            </p>

            <div className="card-paper p-8 sm:p-10 mb-8">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="heading-md">{title || 'A letter to future me'}</h2>
                <span className="mono">{visibility}</span>
              </div>
              <p className="mono text-ink-soft mb-6">
                unlocks {unlockAt.toLocaleString('en-US', { dateStyle: 'long' })}
              </p>
              <div className="border-t border-border-subtle pt-6">
                <p className="body whitespace-pre-wrap">{text}</p>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-full aspect-square object-cover rounded-paper"
                    />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="mb-6 body text-seal" role="alert">{error}</p>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep('date')} className="btn-ghost">
                ← Back
              </button>
              <button onClick={seal} className="btn-primary">
                Seal it
              </button>
            </div>
          </div>
        )}

        {step === 'sealing' && (
          <div className="text-center py-20">
            <span className="seal-stamp mx-auto mb-10 inline-flex animate-seal-pulse">
              tm
            </span>
            <p className="display-sm mb-4">Sealing…</p>
            <p className="body text-ink-muted">
              Encrypting your content with AES-256 and locking it against a
              future Drand round.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Progress({ step }: { step: Step }) {
  const steps: Step[] = ['compose', 'date', 'preview'];
  const idx = steps.indexOf(step);
  if (step === 'sealing' || step === 'done') return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <span
              className={`mono text-xs ${i <= idx ? 'text-seal' : 'text-ink-soft'}`}
            >
              {STEP_LABELS[s]}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i < idx ? 'bg-seal' : 'bg-border-strong'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
