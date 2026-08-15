'use client';

import { useEffect, useState } from 'react';
import {
  loadMediaAsset,
} from '@/lib/storage/capsules';
import type { MediaAssetMeta } from '@/lib/crypto/media';
import { revokeObjectUrl } from '@/lib/crypto/media';
import Waveform from './Waveform';

interface Props {
  userId: string;
  capsuleId: string;
  asset: MediaAssetMeta;
  mediaKey: Uint8Array;
}

export default function MediaAssetRenderer({ userId, capsuleId, asset, mediaKey }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      try {
        const blob = await loadMediaAsset(userId, capsuleId, asset, mediaKey);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        if (!cancelled) setError((e as Error).message ?? 'Could not load media.');
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) revokeObjectUrl(objectUrl);
    };
  }, [userId, capsuleId, asset, mediaKey]);

  if (error) {
    return (
      <div className="rounded-paper border border-border-subtle p-6 bg-cream">
        <p className="body-sm text-seal">{error}</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="rounded-paper border border-border-subtle p-6 bg-cream flex items-center justify-center gap-3">
        <span className="seal-stamp !w-8 !h-8 !text-xs">tm</span>
        <span className="mono text-ink-soft">decrypting {asset.name}…</span>
      </div>
    );
  }

  switch (asset.kind) {
    case 'image':
      return (
        <figure>
          <img
            src={url}
            alt={asset.name}
            className="w-full rounded-paper border border-border-subtle"
          />
          <figcaption className="mono text-xs text-ink-soft mt-2">{asset.name}</figcaption>
        </figure>
      );

    case 'audio':
      return (
        <div className="rounded-paper border border-border-subtle p-5 bg-cream">
          <p className="body font-medium mb-2">{asset.name}</p>
          <Waveform url={url} />
          <audio controls src={url} className="w-full mt-3" preload="metadata" />
        </div>
      );

    case 'video':
      return (
        <div className="rounded-paper border border-border-subtle p-3 bg-cream">
          <video
            controls
            src={url}
            className="w-full rounded-paper"
            preload="metadata"
            playsInline
          />
          <p className="mono text-xs text-ink-soft mt-2">{asset.name}</p>
        </div>
      );

    case 'file':
    default:
      return (
        <div className="rounded-paper border border-border-subtle p-5 bg-cream flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="body font-medium truncate">{asset.name}</p>
            <p className="mono text-xs text-ink-soft">
              {(asset.sizeBytes / 1024).toFixed(1)} KB
            </p>
          </div>
          <a
            href={url}
            download={asset.name}
            className="btn-ghost text-sm py-2 px-5 flex-shrink-0"
          >
            Download
          </a>
        </div>
      );
  }
}
