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
import { useWithdraw } from '@features/withdraw/hooks/useWithdraw';
import type { MoneyMutationResponse } from '@models/index';

/**
 *   Allows the authenticated user to withdraw funds from their account.
 */
const WithdrawForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { cardNetwork } = useSessionStore((s) => s.session);

  const withdrawMutation = useWithdraw(
    (data: MoneyMutationResponse) => {
      const newBalance = parseFloat(data.balance);
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(newBalance);
      toast({
        title: 'Withdrawal successful',
        description: `New balance: ${formatted}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/menu');
    },
    (error: HttpError) => {
      toast({
        title: 'Withdrawal failed',
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
    withdrawMutation.mutate(val);
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
          <Text textStyle="atmScreenTitle" color="white">
            Withdraw Funds
          </Text>
        </Box>
        <Box>
          <FormControl isRequired pt={10}>
            <FormLabel color="white" textStyle="atmScreenLabel">
              Amount ($)
            </FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              isDisabled={withdrawMutation.isLoading}
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
            colorScheme="orange"
            isLoading={withdrawMutation.isLoading}
            textStyle="atmScreenLabel"
          >
            Withdraw
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

export default WithdrawForm;
