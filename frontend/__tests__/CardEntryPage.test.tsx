import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Next.js router for pages/
jest.mock('next/router', () => require('next-router-mock'));

// Silence Chakra toasts (we're not asserting on them here)
jest.mock('@chakra-ui/react', () => {
  const real = jest.requireActual('@chakra-ui/react');
  return { ...real, useToast: () => () => {} };
});

import CardEntryPage from '../pages/index';

function renderPage(ui: React.ReactNode) {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <ChakraProvider>{ui}</ChakraProvider>
    </QueryClientProvider>,
  );
}

describe('CardEntryPage (/) ', () => {
  it('shows the Card Entry UI', () => {
    renderPage(<CardEntryPage />);

    // Headline split across two lines
    expect(screen.getByText(/Insert your/i)).toBeInTheDocument();
    expect(screen.getByText(/^Card$/i)).toBeInTheDocument();

    // Token input + Continue button
    expect(screen.getByLabelText(/Card Token/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter token/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('requires a token before continuing (focuses input)', async () => {
    const user = userEvent.setup();
    renderPage(<CardEntryPage />);

    const input = screen.getByLabelText(/Card Token/i);
    const btn = screen.getByRole('button', { name: /continue/i });

    await act(async () => {
      await user.click(btn);
    });

    expect(input).toHaveFocus();
  });
});
