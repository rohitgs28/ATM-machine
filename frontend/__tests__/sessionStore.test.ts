import { describe, it, expect } from '@jest/globals';
import { useSessionStore } from '@hooks/useSessionStore';

describe('useSessionStore', () => {
  it('updates session state via setSession', () => {
    const { setSession } = useSessionStore.getState();
    setSession({ isAuthenticated: true, customerName: 'Alice', cardNetwork: 'visa' });
    const updated = useSessionStore.getState().session;
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.customerName).toBe('Alice');
    expect(updated.cardNetwork).toBe('visa');
  });

  it('clears session via clearSession', () => {
    const { clearSession } = useSessionStore.getState();
    clearSession();
    const cleared = useSessionStore.getState().session;
    expect(cleared.isAuthenticated).toBe(false);
    expect(cleared.customerName).toBeUndefined();
    expect(cleared.cardNetwork).toBeUndefined();
  });
});
