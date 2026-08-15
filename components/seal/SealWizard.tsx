'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createCapsule, type SealMediaInput } from '@/lib/storage/capsules';
import { generateRecoveryKey } from '@/lib/recovery';
import { STORAGE } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import MediaPicker, { formatBytes, type PendingMedia } from '@/components/media/MediaPicker';
import { createCollaborativeCapsule, type CollaborativeSeal } from '@/lib/storage/collab';
import { STORAGE as TM_STORAGE } from '@/lib/constants';

type Step = 'compose' | 'date' | 'collab' | 'preview' | 'sealing' | 'done';

interface ImageAsset {
  name: string;
  dataUrl: string;
  sizeBytes: number;
}

// Per-capsule media budget (matches the storage quota default of 100 MB/capsule).
const MEDIA_CAP_BYTES = 100 * 1024 * 1024;
const MAX_MEDIA_ITEMS = 20;

const STEP_LABELS: Record<Step, string> = {
  compose: 'compose',
  date: 'unlock date',
  collab: 'co-authors',
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
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [mediaProgress, setMediaProgress] = useState<Record<string, number>>({});
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

  // Collaborative capsule state.
  const [isCollab, setIsCollab] = useState(false);
  const [coAuthors, setCoAuthors] = useState<Array<{ id: string; name: string }>>([]);
  const [threshold, setThreshold] = useState(2);
  const [invites, setInvites] = useState<Array<{ memberName: string; code: string }>>([]);

  useEffect(() => {
    if (!loading && !user) {
      setNeedsAuth(true);
    }
  }, [loading, user]);

  // Pre-fill from "reply to past self" (query params read client-side).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const replyTo = params.get('replyTo');
    const replyTitle = params.get('title');
    if (replyTo) {
      localStorage.setItem(TM_STORAGE.draftPrefix + 'replyTo', replyTo);
    }
    if (replyTitle) {
      setTitle(replyTitle.slice(0, 120));
      const draftText = `\n\n— written in reply to a capsule opened on ${new Date().toLocaleDateString()}`;
      setText((prev) => (prev ? prev : draftText.trim()));
    }
  }, []);

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

  const totalMediaBytes = () => media.reduce((s, m) => s + m.file.size, 0);

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
      const mediaInputs: SealMediaInput[] = media.map((m) => ({
        id: m.id,
        kind: m.kind,
        name: m.name,
        mime: m.mime,
        file: m.file,
      }));

      if (isCollab) {
        const recoveryKey =
          localStorage.getItem(TM_STORAGE.recoveryKeyLocal) ?? '';
        const result = await createCollaborativeCapsule({
          userId: user.id,
          ownerName: user.email?.split('@')[0] ?? user.id.slice(0, 6),
          recoveryKey,
          title: title || 'A collaborative letter',
          text,
          coAuthors,
          threshold,
          unlockAt,
          visibility,
          coverColor: 'seal',
          media: mediaInputs,
          onMediaProgress: (assetId, p) =>
            setMediaProgress((prev) => ({ ...prev, [assetId]: p })),
        });
        setInvites(result.seal.invites.map((i) => ({ memberName: i.memberName, code: i.code })));
        setSealedId(result.capsule.id);
        setShareSlug(result.capsule.shareSlug);
      } else {
        const stored = await createCapsule({
          userId: user.id,
          title: title || 'A letter to future me',
          text,
          images,
          media: mediaInputs,
          unlockAt,
          visibility,
          coverColor: 'seal',
          onMediaProgress: (assetId, p) =>
            setMediaProgress((prev) => ({ ...prev, [assetId]: p })),
        });
        setSealedId(stored.id);
        setShareSlug(stored.shareSlug);
      }

      trackEvent('capsule_sealed', {
        tier: user.tier,
        visibility,
        has_images: images.length > 0,
        media_count: media.length,
        collaborative: isCollab,
        co_authors: coAuthors.length,
        unlock_horizon_months: Math.round(
          (unlockAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
        ),
      });
      setStep('done');
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
      setStep(isCollab ? 'collab' : 'preview');
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

          {invites.length > 0 && (
            <div className="card-paper p-8 mb-8 text-left">
              <p className="mono mb-3">share these invite codes</p>
              <p className="body-sm text-ink-muted mb-5">
                Each co-author needs their code and this capsule id to accept.
                Send them{' '}
                <span className="font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/invite</span>.
              </p>
              <div className="space-y-3">
                {invites.map((inv, i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream border border-border-subtle rounded-paper px-4 py-3">
                    <span className="body-sm flex-1 truncate">{inv.memberName}</span>
                    <code className="font-mono text-sm tracking-widest">{inv.code}</code>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/invite?capsule=${sealedId}&code=${inv.code}`;
                        navigator.clipboard?.writeText(url);
                      }}
                      className="btn-link text-sm"
                    >
                      Copy link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {invites.length > 0 && (
              <Link href="/inbox/collaborations" className="btn-ghost">
                View collaborations
              </Link>
            )}
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

            <div className="space-y-10 mb-10">
              <MediaPicker
                accept="image/*"
                label="images (optional)"
                maxItems={10}
                maxBytesPerFile={MEDIA_CAP_BYTES}
                items={media.filter((m) => m.kind === 'image')}
                onChange={(items) =>
                  setMedia([...media.filter((m) => m.kind !== 'image'), ...items])
                }
                hint="Up to 10 images. Encrypted before upload."
              />
              <MediaPicker
                accept="audio/*"
                label="audio (optional)"
                maxItems={5}
                maxBytesPerFile={MEDIA_CAP_BYTES}
                items={media.filter((m) => m.kind === 'audio')}
                onChange={(items) =>
                  setMedia([...media.filter((m) => m.kind !== 'audio'), ...items])
                }
                hint="Songs, voice memos, interviews. Waveforms shown after unlock."
              />
              <MediaPicker
                accept="video/*"
                label="video (optional)"
                maxItems={5}
                maxBytesPerFile={MEDIA_CAP_BYTES}
                items={media.filter((m) => m.kind === 'video')}
                onChange={(items) =>
                  setMedia([...media.filter((m) => m.kind !== 'video'), ...items])
                }
                hint="Movies, home video, trailers. Chunked encryption."
              />
              <MediaPicker
                accept="*/*"
                label="files (optional)"
                maxItems={MAX_MEDIA_ITEMS}
                maxBytesPerFile={MEDIA_CAP_BYTES}
                items={media.filter((m) => m.kind === 'file')}
                onChange={(items) =>
                  setMedia([...media.filter((m) => m.kind !== 'file'), ...items])
                }
                hint="Any file. Accessible from the file vault after unlock."
              />
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
              <button onClick={() => setStep('collab')} className="btn-primary">
                Preview →
              </button>
            </div>
          </div>
        )}

        {step === 'collab' && (
          <div>
            <h1 className="display-md mb-4 text-balance">Collaborate, or not.</h1>
            <p className="body text-ink-muted mb-10">
              Add co-authors and the capsule will use k-of-n secret sharing —
              it only opens when enough of you return after the unlock date.
            </p>

            <div className="card-paper p-8 mb-8">
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={isCollab}
                  onChange={(e) => {
                    setIsCollab(e.target.checked);
                    if (!e.target.checked) setCoAuthors([]);
                  }}
                  className="mt-1 w-5 h-5 accent-seal"
                />
                <span className="body">
                  Make this a collaborative capsule{' '}
                  <span className="body-sm text-ink-soft">
                    (k-of-n secret sharing · requires threshold co-authors to open)
                  </span>
                </span>
              </label>

              {isCollab && (
                <div className="space-y-6">
                  <div>
                    <label className="block mono mb-2">co-authors</label>
                    {coAuthors.map((co, i) => (
                      <div key={co.id} className="flex items-center gap-3 mb-3">
                        <input
                          value={co.name}
                          onChange={(e) =>
                            setCoAuthors((prev) =>
                              prev.map((c, j) => (j === i ? { ...c, name: e.target.value } : c))
                            )
                          }
                          placeholder={`Co-author ${i + 1} name`}
                          className="flex-1 bg-cream border border-border-subtle rounded-paper px-4 py-3 body-sm focus:border-seal focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            setCoAuthors((prev) => prev.filter((_, j) => j !== i))
                          }
                          className="btn-link text-sm text-seal"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {coAuthors.length < 9 && (
                      <button
                        onClick={() =>
                          setCoAuthors((prev) => [
                            ...prev,
                            { id: crypto.randomUUID(), name: '' },
                          ])
                        }
                        className="btn-link text-sm"
                      >
                        + Add co-author
                      </button>
                    )}
                  </div>

                  {coAuthors.length > 0 && (
                    <div>
                      <label className="block mono mb-2">threshold (how many must return)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={2}
                          max={coAuthors.length + 1}
                          value={threshold}
                          onChange={(e) => setThreshold(Number(e.target.value))}
                          className="flex-1 accent-seal"
                        />
                        <span className="mono">{threshold} of {coAuthors.length + 1}</span>
                      </div>
                      <p className="body-sm text-ink-soft mt-2">
                        The capsule opens only when {threshold} of the{' '}
                        {coAuthors.length + 1} members contribute their share.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <p className="mb-6 body text-seal" role="alert">{error}</p>}

            <div className="flex justify-between">
              <button onClick={() => setStep('date')} className="btn-ghost">
                ← Back
              </button>
              <button onClick={() => setStep('preview')} className="btn-primary">
                Continue →
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
                {isCollab && (
                  <span className="ml-3 text-seal">
                    · collaborative {threshold}-of-{coAuthors.length + 1}
                  </span>
                )}
              </p>
              {isCollab && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="mono text-xs px-2.5 py-1 rounded-full bg-seal/10 text-seal">you (owner)</span>
                  {coAuthors.map((co) => (
                    <span key={co.id} className="mono text-xs px-2.5 py-1 rounded-full border border-border-subtle">
                      {co.name || 'unnamed co-author'}
                    </span>
                  ))}
                </div>
              )}
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
              {media.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
                  <p className="mono mb-3">media · {formatBytes(totalMediaBytes())}</p>
                  {media.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-4 bg-cream rounded-paper px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg">
                          {m.kind === 'image' ? '🖼' : m.kind === 'audio' ? '🎵' : m.kind === 'video' ? '🎬' : '📄'}
                        </span>
                        <div className="min-w-0">
                          <p className="body-sm truncate">{m.name}</p>
                          <p className="mono text-xs text-ink-soft">{formatBytes(m.file.size)}</p>
                        </div>
                      </div>
                      <span className="mono text-xs text-ink-soft flex-shrink-0">{m.kind}</span>
                    </div>
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
            <p className="body text-ink-muted mb-8">
              Encrypting your content with AES-256 and locking it against a
              future Drand round.
            </p>
            {media.length > 0 && (
              <div className="max-w-sm mx-auto space-y-2">
                {media.map((m) => {
                  const p = mediaProgress[m.id] ?? 0;
                  return (
                    <div key={m.id} className="text-left">
                      <div className="flex justify-between body-sm mb-1">
                        <span className="truncate flex-1 mr-3">{m.name}</span>
                        <span className="mono text-ink-soft">{Math.round(p * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-seal transition-all duration-150"
                          style={{ width: `${Math.round(p * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Progress({ step }: { step: Step }) {
  const steps: Step[] = ['compose', 'date', 'collab', 'preview'];
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
