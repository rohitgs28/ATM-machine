import React from 'react';
import { fireEvent, screen } from '@/test-utils';
import { renderWithProviders } from '@/test-utils';

// Mock the deposit hook/mutation
const depositMock = jest.fn();

jest.mock('@features/deposit/hooks/useDeposit', () => ({
  __esModule: true,
  useDeposit: () => ({ mutate: depositMock, isLoading: false }),
}));

import DepositForm from '../DepositForm';

describe('DepositForm', () => {
  beforeEach(() => {
    depositMock.mockClear();
  });

  it('calls deposit mutate when a valid amount is submitted', () => {
    renderWithProviders(<DepositForm />);

    const input = screen.getByLabelText(/amount \(\$\)/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '50.00' } });
    fireEvent.click(screen.getByRole('button', { name: /deposit/i }));

    expect(depositMock).toHaveBeenCalled();
  });

  it('does not call mutate for empty input', () => {
    renderWithProviders(<DepositForm />);
    fireEvent.click(screen.getByRole('button', { name: /deposit/i }));
    expect(depositMock).not.toHaveBeenCalled();
  });
});
