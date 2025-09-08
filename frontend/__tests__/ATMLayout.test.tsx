import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ATMLayout from '../components/ATMLayout';

describe('ATMLayout', () => {
  it('renders the sign, graffiti and children', () => {
    render(
      <ChakraProvider>
        <ATMLayout cardNetwork="visa">
          <div>Test Content</div>
        </ATMLayout>
      </ChakraProvider>,
    );
    // Sign and graffiti images should be present via alt text
    const sign = screen.getByAltText(/ATM sign/i);
    const graffiti = screen.getByAltText(/Graffiti/i);
    expect(sign).toBeInTheDocument();
    expect(graffiti).toBeInTheDocument();
    expect(screen.getByText(/Test Content/)).toBeInTheDocument();
    const overlay = screen.getByTestId('dim-overlay');
    expect(overlay).toHaveStyle('left: 0%');
  });
});
