import React from 'react';
import useCardIdentityGuard from '@hooks/useCardIdentityGuard';
import PinEntry from '@features/pin/PinEntry';

const PinPage: React.FC = () => {
  // Invoke the card guard to perform a redirect if necessary.  The
  // return value indicates whether a card is present;
  const hasCard = useCardIdentityGuard();
  if (!hasCard) {
    return null;
  }
  return <PinEntry />;
};

export default PinPage;
