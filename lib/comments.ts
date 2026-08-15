'use client';

/**
 * Comments on unlocked capsules. Email-tier feature, local for the demo.
 */

export interface CapsuleComment {
  id: string;
  capsuleId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

const KEY_PREFIX = 'tm:comments:';

export function listComments(capsuleId: string): CapsuleComment[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY_PREFIX + capsuleId);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as CapsuleComment[];
    return arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch {
    return [];
  }
}

export function addComment(
  capsuleId: string,
  authorId: string,
  authorName: string,
  body: string
): CapsuleComment {
  const comment: CapsuleComment = {
    id: crypto.randomUUID(),
    capsuleId,
    authorId,
    authorName: authorName || 'anonymous',
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  const all = listComments(capsuleId);
  all.push(comment);
  localStorage.setItem(KEY_PREFIX + capsuleId, JSON.stringify(all));
  return comment;
}

export function deleteComment(capsuleId: string, commentId: string): void {
  const all = listComments(capsuleId).filter((c) => c.id !== commentId);
  localStorage.setItem(KEY_PREFIX + capsuleId, JSON.stringify(all));
}
