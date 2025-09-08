// features/menu/__tests__/Menu.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Menu from '../Menu';
import { useLogout } from '@hooks/useLogout';
import { useSessionStore } from '@hooks/useSessionStore';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@hooks/useLogout', () => ({
  useLogout: jest.fn(),
}));

jest.mock('@hooks/useSessionStore', () => ({
  useSessionStore: jest.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('Menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears session, navigates to /card, and calls logout on Exit', () => {
    const push = jest.fn();
    (useRouter as unknown as jest.Mock).mockReturnValue({ push });

    const mutate = jest.fn();
    (useLogout as unknown as jest.Mock).mockReturnValue({ mutate, isLoading: false });

    const clearSession = jest.fn();
    // Zustand selector-friendly mock
    (useSessionStore as unknown as jest.Mock).mockImplementation((selector: (s: any) => any) =>
      selector({
        session: { customerName: 'Test', cardNetwork: 'visa' },
        clearSession,
      }),
    );

    renderWithProviders(<Menu />);

    fireEvent.click(screen.getByRole('button', { name: /exit/i }));

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/card');
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it('navigates on withdraw/deposit/balance/re-enter pin', () => {
    const push = jest.fn();
    (useRouter as unknown as jest.Mock).mockReturnValue({ push });

    (useLogout as unknown as jest.Mock).mockReturnValue({ mutate: jest.fn(), isLoading: false });

    (useSessionStore as unknown as jest.Mock).mockImplementation((selector: (s: any) => any) =>
      selector({
        session: { customerName: 'Test', cardNetwork: 'visa' },
        clearSession: jest.fn(),
      }),
    );

    renderWithProviders(<Menu />);

    fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));
    expect(push).toHaveBeenCalledWith('/withdraw');

    fireEvent.click(screen.getByRole('button', { name: /deposit/i }));
    expect(push).toHaveBeenCalledWith('/deposit');

    fireEvent.click(screen.getByRole('button', { name: /balance/i }));
    expect(push).toHaveBeenCalledWith('/balance');

    fireEvent.click(screen.getByRole('button', { name: /re-enter pin/i }));
    expect(push).toHaveBeenCalledWith('/pin');
  });
});
