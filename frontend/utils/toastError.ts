import { UseToastOptions } from '@chakra-ui/react';

export function toUserMessage(err: unknown): string {
  /**
   * Attempts to extract a human‑friendly message from various error shapes
   * returned by the API.
   */
  try {
    const e = err as { userMessage?: string; message?: string } | undefined;
    if (e && typeof e.userMessage === 'string' && e.userMessage) {
      return e.userMessage;
    }

    // If the error message is JSON, try to parse validation details.
    if (e && typeof e.message === 'string') {
      try {
        const parsed: unknown = JSON.parse(e.message);
        // parsed may contain a detail array or string.  Guard its shape.
        if (parsed && typeof parsed === 'object' && 'detail' in parsed) {
          const detail = (parsed as { detail?: unknown }).detail;
          if (Array.isArray(detail)) {
            const messages = (detail as Array<{ msg?: string }>)
              .map((d) => d.msg)
              .filter((m): m is string => Boolean(m));
            if (messages.length) return messages.join('\n');
          }
          if (typeof detail === 'string') {
            return detail;
          }
        }
      } catch {
        // message was not JSON; ignore
      }
    }
  } catch {
    // fall through to fallback
  }
  return 'Something went wrong. Please check your input and try again.';
}

export function toastFromError(e: unknown): UseToastOptions {
  const description = toUserMessage(e);
  return {
    status: 'error',
    title: 'Request failed',
    description,
    isClosable: true,
    duration: 4000,
    position: 'top',
  };
}
