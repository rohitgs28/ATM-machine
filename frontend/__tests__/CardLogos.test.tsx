import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CardLogos from '../components/CardLogos';

function withChakra(ui: React.ReactElement) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('CardLogos', () => {
  it('dims the correct number of segments for Visa (one overlay)', () => {
    withChakra(<CardLogos network="visa" />);
    const overlays = screen.getAllByTestId('dim-overlay');
    expect(overlays).toHaveLength(1);
  });

  it('renders two overlays for a mid-range highlight (pulse)', () => {
    withChakra(<CardLogos network="pulse" />);
    const overlays = screen.getAllByTestId('dim-overlay');
    expect(overlays).toHaveLength(2);
  });

  it('renders no overlays for an unknown network', () => {
    withChakra(<CardLogos network="unknown-network" />);
    const overlays = screen.queryAllByTestId('dim-overlay');
    expect(overlays.length).toBe(0);
  });
});
