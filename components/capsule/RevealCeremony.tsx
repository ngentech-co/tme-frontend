'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MediaAssetMeta } from '@/lib/crypto/media';
import MediaAssetRenderer from '@/components/media/MediaAssetRenderer';
import Reactions from './Reactions';
import Comments from './Comments';
import { useAuth } from '@/lib/auth-context';

interface Props {
  title: string;
  text?: string;
  openedAt?: string;
  onComplete?: () => void;
  userId?: string;
  capsuleId?: string;
  media?: MediaAssetMeta[];
  mediaKey?: Uint8Array;
}

type Stage = 'sealing' | 'breaking' | 'unfolding' | 'revealed';

export default function RevealCeremony({
  title,
  text,
  openedAt,
  onComplete,
  userId,
  capsuleId,
  media,
  mediaKey,
}: Props) {
  const [stage, setStage] = useState<Stage>('sealing');

  useEffect(() => {
    if (text !== undefined) {
      // Already opened, skip ceremony intro
      setStage('revealed');
      return;
    }
    const t1 = setTimeout(() => setStage('breaking'), 900);
    const t2 = setTimeout(() => setStage('unfolding'), 1700);
    const t3 = setTimeout(() => setStage('revealed'), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [text]);

  const { user } = useAuth();
  const allowReact = user?.tier === 'email';

  const canRenderMedia =
    stage === 'revealed' && !!userId && !!capsuleId && !!mediaKey && !!media && media.length > 0;

  if (stage === 'revealed' && text !== undefined) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12 sm:py-20">
        <div className="max-w-prose mx-auto">
          <div className="text-center mb-10 animate-fade-up">
            <span className="seal-stamp mx-auto mb-6 inline-flex">✓</span>
            <p className="mono text-seal mb-3">revealed</p>
            <h1 className="display-md mb-3">{title}</h1>
            {openedAt && (
              <p className="mono text-ink-soft">
                opened {new Date(openedAt).toLocaleString()}
              </p>
            )}
          </div>

          {text && (
            <article
              className="card-paper p-10 sm:p-14 mb-10 animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="reading-prose">
                {text.split('\n\n').map((p, i) => (
                  <p key={i} className="body-lg whitespace-pre-wrap text-balance">
                    {p}
                  </p>
                ))}
              </div>
            </article>
          )}

          {canRenderMedia && userId && capsuleId && mediaKey && (
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <p className="mono text-ink-muted">sealed media · {media!.length} item{media!.length === 1 ? '' : 's'}</p>
              {media!.map((asset) => (
                <MediaAssetRenderer
                  key={asset.id}
                  userId={userId}
                  capsuleId={capsuleId}
                  asset={asset}
                  mediaKey={mediaKey}
                />
              ))}
            </div>
          )}

          <Reactions
            capsuleId={capsuleId ?? title}
            allowReact={allowReact}
          />

          <Comments capsuleId={capsuleId ?? title} />

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            {text && (
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="btn-ghost"
              >
                Copy text
              </button>
            )}
            <Link
              href={`/seal?replyTo=${encodeURIComponent(capsuleId ?? '')}&title=${encodeURIComponent(
                `A reply to: ${title}`
              )}`}
              className="btn-ghost"
            >
              Reply to past self
            </Link>
            {onComplete && (
              <button onClick={onComplete} className="btn-primary">
                Back to inbox
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-reading">
        <div className="mb-12">
          {stage === 'sealing' && (
            <span className="seal-stamp mx-auto inline-flex">tm</span>
          )}
          {stage === 'breaking' && (
            <span className="seal-stamp mx-auto inline-flex animate-fade-in">tm</span>
          )}
          {stage === 'unfolding' && (
            <span className="seal-stamp mx-auto inline-flex animate-fade-in">✓</span>
          )}
        </div>

        <h1 className="display-md mb-4 animate-fade-up">{title}</h1>
        <p className="body-lg text-ink-muted animate-fade-up" style={{ animationDelay: '150ms' }}>
          {stage === 'sealing' && 'The seal is responding…'}
          {stage === 'breaking' && 'Breaking the seal…'}
          {stage === 'unfolding' && 'Fetching the future.'}
        </p>
      </div>
    </main>
  );
}
