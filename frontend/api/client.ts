import { HttpError } from '@utils/errors';
import { useSessionStore } from '@hooks/useSessionStore';

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const url = `${base}${path}`;
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });

  // On 401 clear session and redirect
  if (resp.status === 401) {
    try {
      useSessionStore.getState().clearSession();
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined') {
      window.location.assign('/card');
    }
  }

  if (!resp.ok) {
    let raw = await resp.text();
    let userMessage = `${resp.status} ${resp.statusText}`;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.detail) && parsed.detail.length) {
        userMessage = parsed.detail
          .map((d: any) => d?.msg)
          .filter(Boolean)
          .join('\n');
      } else if (typeof parsed?.detail === 'string') {
        userMessage = parsed.detail;
      }
      raw = JSON.stringify(parsed);
    } catch {
    }

    // Construct an HttpError augmented with a userMessage.  
    const err: HttpError & { userMessage?: string } = new HttpError(resp.status, raw);
    err.userMessage = userMessage;
    throw err;
  }

  if (resp.status === 204) return undefined as unknown as T;
  return (await resp.json()) as T;
}
