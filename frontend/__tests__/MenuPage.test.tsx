import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import MenuPage from '../pages/menu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@hooks/useSessionStore';

describe('MenuPage', () => {
  it('renders the menu options and highlights the network', () => {
    // Pre‑populate the session store with a test user
    const { setSession } = useSessionStore.getState();
    setSession({ isAuthenticated: true, customerName: 'Test User', cardNetwork: 'visa' });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <MenuPage />
        </ChakraProvider>
      </QueryClientProvider>,
    );
    // Greeting includes the user's name
    expect(screen.getByText(/Hi Test User!/i)).toBeInTheDocument();
    // All menu options should be present
    expect(screen.getByText(/Exit/)).toBeInTheDocument();
    expect(screen.getByText(/Balance/)).toBeInTheDocument();
    expect(screen.getByText(/Withdraw/)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/)).toBeInTheDocument();
    expect(screen.getByText(/Re-Enter PIN/)).toBeInTheDocument();
    // The overlay dims the left side for Visa
    const overlay = screen.getByTestId('dim-overlay');
    expect(overlay).toHaveStyle('left: 0%');
  });
});
