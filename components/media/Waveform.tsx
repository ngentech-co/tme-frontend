'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  url: string;
  color?: string;
  barCount?: number;
}

/**
 * Canvas waveform rendered from decoded audio. Works in all modern browsers
 * via the Web Audio API — no external library.
 */
export default function Waveform({ url, color = '#B5392A', barCount = 48 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    const render = async () => {
      try {
        const ctx = new AudioContext();
        const arrayBuf = await (await fetch(url)).arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        if (cancelled) {
          ctx.close();
          return;
        }

        const peaks = computePeaks(audioBuf, barCount);
        drawBars(canvas, peaks, color);
        ctx.close();
      } catch (e) {
        if (!cancelled) {
          setError('Could not decode audio for waveform.');
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [url, color, barCount]);

  if (error) {
    return <p className="mono text-xs text-ink-soft">{error}</p>;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16"
      width={600}
      height={64}
      aria-label="Audio waveform"
    />
  );
}

function computePeaks(buffer: AudioBuffer, count: number): number[] {
  const channel = buffer.getChannelData(0);
  const blockSize = Math.floor(channel.length / count);
  const peaks: number[] = [];
  for (let i = 0; i < count; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channel[i * blockSize + j]);
    }
    peaks.push(sum / blockSize);
  }
  // normalize
  const max = Math.max(...peaks, 0.0001);
  return peaks.map((p) => Math.max(0.03, p / max));
}

function drawBars(
  canvas: HTMLCanvasElement,
  peaks: number[],
  color: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  const gap = 2;
  const barW = (w - gap * (peaks.length - 1)) / peaks.length;
  peaks.forEach((p, i) => {
    const barH = Math.max(2, p * h * 0.9);
    const x = i * (barW + gap);
    const y = (h - barH) / 2;
    ctx.fillRect(x, y, barW, barH);
  });
}
