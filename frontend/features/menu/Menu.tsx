import React from 'react';
import { useRouter } from 'next/router';
import { Box, Text, useToast } from '@chakra-ui/react';
import { useLogout } from '@hooks/useLogout';
import ATMLayout from '@components/ATMLayout';
import { useSessionStore } from '@hooks/useSessionStore';
import { ROW0, STEP, EDGE, LINE_LEN, LINE_INSET, TEXT_MID, LABEL_Y_OFFSET } from './menuConfig';

const Menu: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  const { customerName, cardNetwork } = useSessionStore((s) => s.session);
  const clearSession = useSessionStore((s) => s.clearSession);

  const logoutMutation = useLogout(
    () => {
      toast({ title: 'Logged out', status: 'info', duration: 2000, isClosable: true });
    },
    (error) => {
      toast({
        title: 'Logout failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  );

  // clear session, navigate to card screen, then call logout
  const handleExit = () => {
    clearSession();
    void router.push('/card');
    logoutMutation.mutate();
  };

  const leftHandlers: Array<(() => void) | undefined> = [
    undefined,
    undefined,
    () => router.push('/withdraw'),
    () => router.push('/deposit'),
  ];
  const rightHandlers: Array<(() => void) | undefined> = [
    undefined,
    handleExit,
    () => router.push('/balance'),
    () => router.push('/pin'),
  ];

  const lineSx = {
    position: 'absolute' as const,
    height: '2px',
    bg: 'white',
    opacity: 0.9,
    zIndex: 1,
    pointerEvents: 'none' as const,
  };

  // text style for menu labels
  const labelTextProps = {
    textStyle: 'atmMenuItem' as const,
    fontFamily:
      'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
    letterSpacing: '0.5px',
    fontWeight: 400,
    textTransform: 'none' as const,
  };

  // base style for label containers
  const labelSx = {
    position: 'absolute' as const,
    color: 'white',
    textDecoration: 'none',
    zIndex: 2,
    cursor: 'pointer',
    userSelect: 'none' as const,
    _hover: { textDecoration: 'none' },
    _focus: { textDecoration: 'none', outline: 'none' },
  };

  return (
    <ATMLayout
      cardNetwork={cardNetwork}
      leftButtonHandlers={leftHandlers}
      rightButtonHandlers={rightHandlers}
    >
      <Box pt="4" textAlign="center">
        <Text textStyle="atmScreenTitle">Hi {customerName || 'Guest'}!</Text>
        <Text textStyle="atmScreenTitle" mt="-1">
          Please make a choice...
        </Text>
      </Box>

      {/* Right column labels (aligns with right-side physical buttons) */}
      <Box
        as="button"
        type="button"
        aria-label="Exit"
        onClick={handleExit}
        sx={labelSx}
        right={`${EDGE}px`}
        top={`${ROW0 + STEP - LABEL_Y_OFFSET}px`}
      >
        <Text as="span" {...labelTextProps}>
          Exit
        </Text>
      </Box>

      <Box
        as="button"
        type="button"
        aria-label="Balance"
        onClick={() => router.push('/balance')}
        sx={labelSx}
        right={`${EDGE}px`}
        top={`${ROW0 + STEP * 2 - LABEL_Y_OFFSET}px`}
      >
        <Text as="span" {...labelTextProps}>
          Balance
        </Text>
      </Box>

      <Box
        as="button"
        type="button"
        aria-label="Re-Enter PIN"
        onClick={() => router.push('/pin')}
        sx={labelSx}
        right={`${EDGE}px`}
        top={`${ROW0 + STEP * 3 - LABEL_Y_OFFSET}px`}
      >
        <Text as="span" {...labelTextProps}>
          Re-Enter PIN
        </Text>
      </Box>

      {/* Left column labels  */}
      <Box
        as="button"
        type="button"
        aria-label="Withdraw"
        onClick={() => router.push('/withdraw')}
        sx={labelSx}
        left={`${EDGE}px`}
        top={`${ROW0 + STEP * 2 - LABEL_Y_OFFSET}px`}
      >
        <Text as="span" {...labelTextProps}>
          Withdraw
        </Text>
      </Box>

      <Box
        as="button"
        type="button"
        aria-label="Deposit"
        onClick={() => router.push('/deposit')}
        sx={labelSx}
        left={`${EDGE}px`}
        top={`${ROW0 + STEP * 3 - LABEL_Y_OFFSET}px`}
      >
        <Text as="span" {...labelTextProps}>
          Deposit
        </Text>
      </Box>

      {/* Connector line/strip  */}
      <Box
        sx={lineSx}
        right={`${LINE_INSET}px`}
        top={`${ROW0 + STEP + TEXT_MID}px`}
        width={`${LINE_LEN}px`}
        aria-hidden
      />
      <Box
        sx={lineSx}
        left={`${LINE_INSET}px`}
        top={`${ROW0 + STEP * 2 + TEXT_MID}px`}
        width={`${LINE_LEN}px`}
        aria-hidden
      />
      <Box
        sx={lineSx}
        right={`${LINE_INSET}px`}
        top={`${ROW0 + STEP * 2 + TEXT_MID}px`}
        width={`${LINE_LEN}px`}
        aria-hidden
      />
      <Box
        sx={lineSx}
        left={`${LINE_INSET}px`}
        top={`${ROW0 + STEP * 3 + TEXT_MID}px`}
        width={`${LINE_LEN}px`}
        aria-hidden
      />
      <Box
        sx={lineSx}
        right={`${LINE_INSET}px`}
        top={`${ROW0 + STEP * 3 + TEXT_MID}px`}
        width={`${LINE_LEN}px`}
        aria-hidden
      />
    </ATMLayout>
  );
};

export default Menu;
