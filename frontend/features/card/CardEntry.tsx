import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, FormLabel, Input, Text, useToast } from '@chakra-ui/react';
import ATMLayout from '@components/ATMLayout';
import { useSessionStore } from '@hooks/useSessionStore';

/**
 * Lets the user enter an  card token (simulating a card insert).
 * On submit, persists token in session and navigates to /pin.
 */
const CardEntry: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { setCardIdentity } = useSessionStore();

  const [token, setToken] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus so users can type immediately
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Bezel handlers: only top-right focuses the input
  const leftHandlers: Array<(() => void) | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const rightHandlers: Array<(() => void) | undefined> = [
    () => inputRef.current?.focus(),
    undefined,
    undefined,
    undefined,
  ];

  const handleContinue = () => {
    const trimmed = token.trim();
    if (!trimmed) {
      toast({
        status: 'error',
        title: 'Card token required',
        description: 'Please enter your card token to continue.',
        duration: 3000,
        isClosable: true,
      });
      inputRef.current?.focus();
      return;
    }
    // Persist card token and clear any previous BIN/last4 identity
    setCardIdentity({ cardToken: trimmed, bin: null, last4: null });
    router.push('/pin');
  };

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    handleContinue();
  };

  return (
    <ATMLayout leftButtonHandlers={leftHandlers} rightButtonHandlers={rightHandlers}>
      <Box pt="4" textAlign="center">
        <Text textStyle="atmScreenTitle">Insert your</Text>
        <Text textStyle="atmScreenTitle" mt="-1">
          Card
        </Text>
      </Box>

      <Box
        as="form"
        onSubmit={handleSubmit}
        px="6"
        mt="6"
        display="flex"
        flexDirection="column"
        gap="24px"
      >
        <FormControl>
          <FormLabel htmlFor="card-token" textStyle="atmScreenLabel">
            Card Token
          </FormLabel>
          <Input
            id="card-token"
            ref={inputRef}
            value={token}
            textStyle="atmScreenLabel"
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token"
            bg="white"
            color="black"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setToken('');
                // keep focus for quick retype
                requestAnimationFrame(() => inputRef.current?.focus());
              }
            }}
          />
        </FormControl>

        <Box display="flex" justifyContent="center">
          <Button type="submit" colorScheme="blue" textStyle="atmScreenTitle">
            Continue
          </Button>
        </Box>
      </Box>
    </ATMLayout>
  );
};

export default CardEntry;
