import React from 'react';
import { Input } from '@chakra-ui/react';

type Props = { pin: string; setPin: (s: string) => void; disabled?: boolean };

const PinHiddenInput = React.forwardRef<HTMLInputElement, Props>(
  ({ pin, setPin, disabled }, ref) => (
    <Input
      id="pin"
      type="password"
      value={pin}
      maxLength={4}
      onChange={(e) => setPin(e.target.value.replace(/\D+/g, '').slice(0, 4))}
      inputMode="numeric"
      pattern="[0-9]*"
      variant="flushed"
      placeholder="••••"
      disabled={disabled}
      ref={ref}
      onBlur={() => (ref as React.RefObject<HTMLInputElement>)?.current?.focus?.()}
      style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }}
    />
  ),
);
PinHiddenInput.displayName = 'PinHiddenInput';
export default PinHiddenInput;
