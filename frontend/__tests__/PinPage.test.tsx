import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import PinPage from '../pages/pin';

jest.mock('@hooks/useAuthGuard', () => ({
  __esModule: true,
  default: () => true,
  useAuthGuard: () => true,
}));

jest.mock('@hooks/useCardIdentityGuard', () => ({
  __esModule: true,
  default: () => true,
  useCardIdentityGuard: () => true,
}));

describe('PinPage smoke', () => {
  it('renders the PIN page UI', () => {
    renderWithProviders(<PinPage />);
    expect(screen.getByRole('button', { name: /enter/i })).toBeTruthy();
  });
});
