'use client';

import { useEffect, useState } from 'react';
import {
  addComment,
  deleteComment,
  listCommentsAsync,
  type CapsuleComment,
} from '@/lib/comments';
import { useAuth } from '@/lib/auth-context';

interface Props {
  capsuleId: string;
}

export default function Comments({ capsuleId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CapsuleComment[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const allowComment = user?.tier === 'email';

  useEffect(() => {
    listCommentsAsync(capsuleId).then(setComments);
  }, [capsuleId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    if (body.trim().length > 1000) {
      setError('Comments are limited to 1000 characters.');
      return;
    }
    setError(null);
    addComment(
      capsuleId,
      user.id,
      user.email?.split('@')[0] ?? 'you',
      body
    );
    setBody('');
    listCommentsAsync(capsuleId).then(setComments);
  };

  const onDelete = (id: string) => {
    deleteComment(capsuleId, id);
    listCommentsAsync(capsuleId).then(setComments);
  };

  return (
    <div className="card-paper p-6 mb-10">
      <div className="flex items-center justify-between mb-5">
        <p className="mono">comments</p>
        <span className="mono text-xs text-ink-soft">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {comments.length === 0 ? (
        <p className="body-sm text-ink-soft mb-6">
          No comments yet. {allowComment ? 'Be the first.' : ''}
        </p>
      ) : (
        <ul className="space-y-4 mb-6">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-border-subtle last:border-b-0 pb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="mono text-xs text-seal">{c.authorName}</span>
                <div className="flex items-center gap-3">
                  <span className="mono text-xs text-ink-soft">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </span>
                  {user?.id === c.authorId && (
                    <button onClick={() => onDelete(c.id)} className="btn-link text-xs text-seal">
                      delete
                    </button>
                  )}
                </div>
              </div>
              <p className="body whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {allowComment ? (
        <form onSubmit={submit}>
          <label className="block mono mb-2">add a comment</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="A kind word for whoever opened this…"
            className="w-full bg-cream border border-border-subtle rounded-paper px-4 py-3 body-sm resize-none focus:border-seal focus:outline-none"
          />
          {error && <p className="mt-2 body-sm text-seal">{error}</p>}
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!body.trim()}
              className="btn-primary text-sm py-2 px-6"
            >
              Comment
            </button>
          </div>
        </form>
      ) : (
        <p className="body-sm text-ink-soft">
          Commenting is an email-tier feature.
        </p>
      )}
    </div>
  );
}
