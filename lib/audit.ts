'use client';

/**
 * Local audit trail of account + capsule actions. In a real deployment these
 * append to the `audit_log` table; here they persist to localStorage so the
 * Settings → Legal viewer shows a truthful, timestamped history.
 */

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  detail?: string;
  createdAt: string;
}

const KEY = 'tm:audit';

export function listAudit(userId: string, limit = 100): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const all = JSON.parse(raw) as AuditEntry[];
    return all
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function logAudit(userId: string, action: string, detail?: string): void {
  if (typeof window === 'undefined') return;
  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    userId,
    action,
    detail,
    createdAt: new Date().toISOString(),
  };
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as AuditEntry[];
    } catch {
      return [];
    }
  })();
  all.push(entry);
  localStorage.setItem(KEY, JSON.stringify(all.slice(-500)));
}
