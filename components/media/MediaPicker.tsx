'use client';

import { useRef, useState } from 'react';
import {
  mediaKindForMime,
  type MediaAssetMeta,
} from '@/lib/crypto/media';

export interface PendingMedia {
  id: string;
  kind: MediaAssetMeta['kind'];
  name: string;
  mime: string;
  file: File;
  previewUrl?: string;
}

interface Props {
  accept: string;
  label: string;
  maxItems: number;
  maxBytesPerFile: number;
  items: PendingMedia[];
  onChange: (items: PendingMedia[]) => void;
  disabled?: boolean;
  hint?: string;
}

export default function MediaPicker({
  accept,
  label,
  maxItems,
  maxBytesPerFile,
  items,
  onChange,
  disabled,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFiles = (files: FileList | null) => {
    if (!files || disabled) return;
    setError(null);
    const accepted: PendingMedia[] = [];
    const available = maxItems - items.length;

    for (const file of Array.from(files).slice(0, available)) {
      if (file.size > maxBytesPerFile) {
        setError(
          `"${file.name}" exceeds the ${formatBytes(maxBytesPerFile)} limit.`
        );
        continue;
      }
      const id = crypto.randomUUID();
      const kind = mediaKindForMime(file.type);
      const entry: PendingMedia = {
        id,
        kind,
        name: file.name,
        mime: file.type,
        file,
      };
      if (kind === 'image') {
        entry.previewUrl = URL.createObjectURL(file);
      }
      accepted.push(entry);
    }

    if (accepted.length > 0) {
      onChange([...items, ...accepted].slice(0, maxItems));
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="mono">{label}</span>
        <span className="mono text-ink-soft">
          {items.length}/{maxItems}
        </span>
      </div>

      {hint && <p className="body-sm text-ink-muted mb-3">{hint}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative rounded-paper border border-border-subtle overflow-hidden group"
          >
            {item.kind === 'image' && item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-cream flex items-center justify-center text-3xl">
                {item.kind === 'audio' ? '🎵' : item.kind === 'video' ? '🎬' : '📄'}
              </div>
            )}
            <div className="p-2 border-t border-border-subtle">
              <p className="body-sm truncate">{item.name}</p>
              <p className="mono text-xs text-ink-soft">{formatBytes(item.file.size)}</p>
            </div>
            <button
              onClick={() => remove(item.id)}
              className="absolute top-1.5 right-1.5 bg-ink/80 text-cream rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${item.name}`}
            >
              ×
            </button>
          </div>
        ))}

        {items.length < maxItems && (
          <label className="aspect-square rounded-paper border border-dashed border-border-strong flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-seal transition-colors text-center p-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple
              onChange={(e) => onFiles(e.target.files)}
              className="sr-only"
              disabled={disabled}
            />
            <span className="text-2xl text-ink-muted">+</span>
            <span className="body-sm text-ink-muted">Add {label.toLowerCase()}</span>
          </label>
        )}
      </div>

      {error && <p className="body-sm text-seal mb-2" role="alert">{error}</p>}
    </div>
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
