import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, FormLabel, Text, useToast } from '@chakra-ui/react';
import { UseMutationResult } from '@tanstack/react-query';
import ATMLayout from '@components/ATMLayout';
import { HttpError } from '@utils/errors';
import { useSessionStore } from '@hooks/useSessionStore';
import { toastFromError } from '@utils/toastError';
import { PinLoginArgs, usePinLogin } from '@features/pin/hooks/usePinLogin';
import type { PinLoginResponse } from '@models/index';
import PinHiddenInput from './components/PinHiddenInput';
import PinDisplay from './components/PinDisplay';
import usePinKeyboard from './hooks/usePinKeyboard';

/** PinEntry page that composes hidden input, display, keyboard hook and login mutation */
const PinEntry: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const router = useRouter();
  const { setSession, session } = useSessionStore();
  const toast = useToast();
  const pinInputRef = useRef<HTMLInputElement | null>(null);

  const pinLogin: UseMutationResult<PinLoginResponse, HttpError, PinLoginArgs> = usePinLogin(
    (data: PinLoginResponse) => {
      // on success: set session, show toast, navigate to menu
      setSession({
        isAuthenticated: true,
        customerName: data.customerName,
        cardNetwork: data.cardNetwork,
      });
      toast({
        title: `Welcome, ${data.customerName}!`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      void router.push('/menu');
    },
    (err: HttpError) => {
      toast(toastFromError(err));
    },
  );

  const hasIsPending = (m: unknown): m is { isPending: boolean } =>
    typeof m === 'object' && m !== null && 'isPending' in (m as object);

  const isMutating = hasIsPending(pinLogin) ? pinLogin.isPending : pinLogin.isLoading;

  // build request payload including optional cardToken
  const buildRequestBody = useCallback(
    (p: string): PinLoginArgs => ({
      pin: p,
      ...(session.cardToken ? { cardToken: session.cardToken } : {}),
    }),
    [session.cardToken],
  );

  const onEnter = useCallback(
    (currentPin: string) => {
      pinLogin.mutate(buildRequestBody(currentPin));
    },
    [pinLogin, buildRequestBody],
  );

  usePinKeyboard(pin, setPin, pinInputRef, onEnter);

  // form submit handler with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      toast({
        status: 'error',
        title: 'Invalid PIN',
        description: 'Please enter a 4-digit PIN.',
        duration: 6000,
        isClosable: true,
      });
      pinInputRef.current?.focus();
      return;
    }
    pinLogin.mutate(buildRequestBody(pin));
  };

  const rightHandlers: Array<(() => void) | undefined> = [
    undefined,
    undefined,
    undefined,
    () => pinInputRef.current?.focus(),
  ];

  return (
    <ATMLayout rightButtonHandlers={rightHandlers}>
      <Box textAlign="center" pt="6">
        <Text textStyle="atmScreenTitle">Welcome to the</Text>
        <Text textStyle="atmScreenTitle" mt="-1">
          ATM
        </Text>
      </Box>

      <Box
        as="form"
        onSubmit={handleSubmit}
        px="6"
        mt="6"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="4"
      >
        <FormControl isRequired width="100%">
          <FormLabel htmlFor="pin" textStyle="atmScreenLabel" display="flex" alignItems="center">
            Enter PIN&nbsp;
            <Text as="span" color="red" fontSize="md" lineHeight="0">
              *
            </Text>
          </FormLabel>

          {/* Hidden native input (forwardRef<HTMLInputElement, Props>) */}
          <PinHiddenInput pin={pin} setPin={setPin} disabled={isMutating} ref={pinInputRef} />

          {/* Visual PIN display (bullets/circles) */}
          <PinDisplay filled={pin.length} onClick={() => pinInputRef.current?.focus()} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          isLoading={isMutating}
          mt="4"
          textStyle="atmScreenTitle"
        >
          Enter
        </Button>
      </Box>
    </ATMLayout>
  );
};

export default PinEntry;
