import { renderHook } from '@testing-library/react';

const replaceMock = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock('../useMounted', () => ({
  __esModule: true,
  default: () => true, 
}));

jest.mock('../useSessionStore', () => ({
  __esModule: true,
  useSessionStore: jest.fn(),
}));

import { useCardIdentityGuard } from '../useCardIdentityGuard';
import { useSessionStore } from '../useSessionStore';

describe('useCardIdentityGuard', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    (useSessionStore as unknown as jest.Mock).mockReset();
  });

  it('redirects to /card when no token present', () => {
    (useSessionStore as unknown as jest.Mock).mockImplementation(
      (selector: any) => selector({ session: { cardToken: null } }),
    );

    const { result } = renderHook(() => useCardIdentityGuard());
    expect(result.current).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith('/card');
  });

  it('returns true and does not redirect when token is present', () => {
    (useSessionStore as unknown as jest.Mock).mockImplementation(
      (selector: any) => selector({ session: { cardToken: 'tok123' } }),
    );

    const { result } = renderHook(() => useCardIdentityGuard());
    expect(result.current).toBe(true);
    expect(replaceMock).not.toHaveBeenCalled();
  });

});
