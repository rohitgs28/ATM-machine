import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStore } from '@hooks/useSessionStore';
import useMounted from '@hooks/useMounted';

/**
 * Custom hook that protects authenticated routes by redirecting the
 * user back to the card insertion screen (`/card`) if they are not
 * currently authenticated.
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const mounted = useMounted();
  const isAuthenticated = useSessionStore((s) => s.session?.isAuthenticated ?? false);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace('/card');
    }
  }, [mounted, isAuthenticated, router]);

  return isAuthenticated;
}
export default useAuthGuard;
