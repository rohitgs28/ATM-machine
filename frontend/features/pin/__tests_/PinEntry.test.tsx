import React from 'react';
import { fireEvent, screen } from '@/test-utils';
import { renderWithProviders } from '@/test-utils';

const mutateMock = jest.fn();

jest.mock('@features/pin/hooks/usePinLogin', () => ({
  __esModule: true,
  usePinLogin: () => ({ mutate: mutateMock, isLoading: false }),
}));

import PinEntry from '../PinEntry';

describe('PinEntry', () => {
  beforeEach(() => mutateMock.mockClear());

  it('calls mutate when a valid PIN is entered and Enter clicked', () => {
    renderWithProviders(<PinEntry />);
    const input = screen.getByLabelText(/enter pin/i);
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(mutateMock).toHaveBeenCalled();
  });

  it('does not call mutate for invalid short PIN', () => {
    renderWithProviders(<PinEntry />);
    const input = screen.getByLabelText(/enter pin/i);
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(mutateMock).not.toHaveBeenCalled();
  });
});
