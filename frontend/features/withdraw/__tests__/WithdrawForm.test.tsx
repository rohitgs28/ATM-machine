import React from 'react';
import { fireEvent, screen } from '@/test-utils';
import { renderWithProviders } from '@/test-utils';
// Mock withdraw mutation
const withdrawMock = jest.fn();
jest.mock('@features/withdraw/hooks/useWithdraw', () => ({
  __esModule: true,
  useWithdraw: () => ({ mutate: withdrawMock, isLoading: false }),
}));

import WithdrawForm from '../WithdrawForm';

describe('WithdrawForm', () => {
  beforeEach(() => {
    withdrawMock.mockClear();
  });

  it('calls withdraw mutate when a valid amount is entered', () => {
    renderWithProviders(<WithdrawForm />);

    const input = screen.getByLabelText(/amount \(\$\)/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20.00' } });

    fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));

    expect(withdrawMock).toHaveBeenCalled();
  });

  it('does not call mutate for empty input', () => {
    renderWithProviders(<WithdrawForm />);
    fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));
    expect(withdrawMock).not.toHaveBeenCalled();
  });
});
