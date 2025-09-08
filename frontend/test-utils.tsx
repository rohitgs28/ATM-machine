import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme'; // adjust path if needed

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

/**
 * renderWithProviders wraps a component with Chakra and React Query providers
 * and returns the rtl render result plus the QueryClient (so tests can spy).
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: { queryClient?: QueryClient } & Omit<RenderOptions, 'queries'>,
) {
  const client = options?.queryClient ?? createQueryClient();

  const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={client}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );

  const result = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...result, queryClient: client };
}

// re-export everything from testing library
export * from '@testing-library/react';
export { rtlRender as render };
