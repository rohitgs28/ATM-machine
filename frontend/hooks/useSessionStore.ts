import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Zustand-based session store used by the ATM frontend.  This hook tracks
 * authentication state and a few pieces of card/customer metadata across
 * pages. 
 */
interface SessionState {
  isAuthenticated: boolean;
  customerName?: string;
  cardNetwork?: string;
  cardToken?: string | null;
  bin?: string | null;
  last4?: string | null;
}

interface SessionStore {
  session: SessionState;
  setSession: (partial: Partial<SessionState>) => void;
  clearSession: () => void;
  setCardIdentity: (id: {
    cardToken?: string | null;
    bin?: string | null;
    last4?: string | null;
  }) => void;
  clearCardIdentity: () => void;
}

export const useSessionStore = create<SessionStore>()(
  // Persist the entire session in localStorage. 
  persist(
    (set) => ({
      session: {
        isAuthenticated: false,
        customerName: undefined,
        cardNetwork: undefined,
        cardToken: null,
        bin: null,
        last4: null,
      },
      setSession: (partial) =>
        set((state) => ({
          session: {
            ...state.session,
            ...partial,
          },
        })),
      clearSession: () =>
        set(() => ({
          session: {
            isAuthenticated: false,
            customerName: undefined,
            cardNetwork: undefined,
            cardToken: null,
            bin: null,
            last4: null,
          },
        })),
      setCardIdentity: (id) =>
        set((state) => ({
          session: {
            ...state.session,
            cardToken: id.cardToken ?? null,
            bin: id.bin ?? null,
            last4: id.last4 ?? null,
          },
        })),
      clearCardIdentity: () =>
        set((state) => ({
          session: {
            ...state.session,
            cardToken: null,
            bin: null,
            last4: null,
          },
        })),
    }),
    {
      name: 'atm-session',
      // Create a JSON storage that falls back to a no-op storage when
      // running on the server.
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          // Dummy storage for SSR: returns null and ignores set/remove.
          return {
            getItem: (_key: string) => null,
            setItem: (_key: string, _value: string) => {},
            removeItem: (_key: string) => {},
          } as Storage;
        }
        return localStorage;
      }),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
