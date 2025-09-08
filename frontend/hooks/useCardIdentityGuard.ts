import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStore } from '@hooks/useSessionStore';
import useMounted from '@hooks/useMounted';

/**
 * Guard that requires a card token to be present before allowing access.
 * If no token is present, redirect to /card and return false.
 */
export function useCardIdentityGuard(): boolean {
  const router = useRouter();
  const mounted = useMounted();

  // Only consider cardToken now (BIN/last4 are ignored for access checks)
  const { cardToken = null } = useSessionStore((s) => s.session ?? { cardToken: null });

  const hasCard = Boolean(cardToken);

  useEffect(() => {
    if (!mounted) return;
    if (!hasCard) {
      router.replace('/card');
    }
  }, [mounted, hasCard, router]);

  return hasCard;
}

export default useCardIdentityGuard;
