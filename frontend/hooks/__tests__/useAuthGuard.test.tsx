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

import { useAuthGuard } from '../useAuthGuard';
import { useSessionStore } from '../useSessionStore';

describe('useAuthGuard', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    (useSessionStore as unknown as jest.Mock).mockReset();
  });

  it('redirects to /card when not authenticated', () => {
    (useSessionStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ session: { isAuthenticated: false } }),
    );

    renderHook(() => useAuthGuard());
    expect(replaceMock).toHaveBeenCalledWith('/card');
  });

  it('does not redirect when authenticated', () => {
    (useSessionStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ session: { isAuthenticated: true } }),
    );

    renderHook(() => useAuthGuard());
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
