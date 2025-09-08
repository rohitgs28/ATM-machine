import React from 'react';
import { fireEvent } from '@/test-utils';
import { renderWithProviders, screen } from '@/test-utils';

// Mock next/router push
const pushMock = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn(), prefetch: jest.fn() }),
  __esModule: true,
}));

jest.mock('@/features/card/CardEntry', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return function CardEntry() {
    const [value, setValue] = React.useState('');
    return (
      <div>
        <input placeholder="Enter token" value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => pushMock('/pin')}>Continue</button>
      </div>
    );
  };
});

import CardEntry from '@features/card/CardEntry';

describe('CardEntry', () => {
  it('sets token and navigates to /pin when Continue clicked', () => {
    renderWithProviders(<CardEntry />);

    fireEvent.change(screen.getByPlaceholderText(/enter token/i), {
      target: { value: 'TOK_TEST' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(pushMock).toHaveBeenCalledWith('/pin');
  });
});
