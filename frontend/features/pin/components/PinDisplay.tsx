import React from 'react';
import { Text } from '@chakra-ui/react';

type Props = { length?: number; filled: number; onClick?: () => void };

const PinDisplay: React.FC<Props> = ({ length = 4, filled, onClick }) => (
  <Text
    mt="4"
    fontSize="32px"
    letterSpacing="10px"
    textAlign="center"
    color="atm.textWhite"
    onClick={onClick}
  >
    {Array.from({ length }).map((_, i) => (
      <span key={i}>{i < filled ? '•' : '◦'}</span>
    ))}
  </Text>
);

export default PinDisplay;
