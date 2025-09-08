import React from 'react';
import { fireEvent, screen, renderWithProviders } from '@/test-utils';

const refetchMock = jest.fn();

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    __esModule: true,
    ...actual,
    useQuery: () => ({
      data: { balance: '99.00' },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchMock,
    }),
  };
});

import BalanceView from '../BalanceView';

describe('BalanceView', () => {
  beforeEach(() => {
    refetchMock.mockClear();
  });

  it('renders the balance and refresh triggers refetch', () => {
    renderWithProviders(<BalanceView />);

    // Component formats as currency, so assert "$99.00"
    expect(screen.getByText(/\$99\.00/)).toBeInTheDocument();

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshBtn);
    expect(refetchMock).toHaveBeenCalled();
  });
});
