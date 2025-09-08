import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import ATMLayout from '@components/ATMLayout';
import { HttpError } from '@utils/errors';
import { useSessionStore } from '@hooks/useSessionStore';
import { useDeposit } from '@features/deposit/hooks/useDeposit';
import type { MoneyMutationResponse } from '@models/index';

/**
 *  Provides a form for depositing funds into the authenticated user's account.
 */
const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { cardNetwork } = useSessionStore((s) => s.session);

  const depositMutation = useDeposit(
    (data: MoneyMutationResponse) => {
      const newBalance = parseFloat(data.balance);
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(newBalance);
      toast({
        title: 'Deposit successful',
        description: `New balance: ${formatted}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/menu');
    },
    (error: HttpError) => {
      toast({
        title: 'Deposit failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      if (error.status === 401) {
        router.push('/card');
      }
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Enter a positive number',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    depositMutation.mutate(val);
  };

  return (
    <ATMLayout cardNetwork={cardNetwork}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box textAlign="center">
          <Text textStyle="atmScreenTitle" color="white" pb={10}>
            Deposit Funds
          </Text>
        </Box>
        <Box>
          <FormControl isRequired>
            <FormLabel color="white" textStyle="atmScreenLabel">
              Amount ($)
            </FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              isDisabled={depositMutation.isLoading}
              variant="flushed"
              color="white"
              borderColor="whiteAlpha.700"
              _placeholder={{ color: 'whiteAlpha.600' }}
            />
          </FormControl>
        </Box>
        <Stack spacing={3} mt={4}>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={depositMutation.isLoading}
            textStyle="atmScreenLabel"
          >
            Deposit
          </Button>
          <Button
            onClick={() => router.push('/menu')}
            variant="ghost"
            colorScheme="whiteAlpha"
            textStyle="atmScreenLabel"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </ATMLayout>
  );
};

export default DepositForm;
