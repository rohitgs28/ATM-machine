import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import ATMLayout from '@components/ATMLayout';
import { api } from '@api/client';
import { HttpError } from '@utils/errors';
import { useSessionStore } from '@hooks/useSessionStore';
import type { BalanceResponse } from '@models/index';

/**
 * BalanceView feature component.  Displays the authenticated user's current account balance.  
 */
const BalanceView: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { cardNetwork } = useSessionStore((s) => s.session);

 
  const { data, isLoading, isError, error, refetch } = useQuery<BalanceResponse, HttpError>({
    queryKey: ['balance'],
    queryFn: async () => api<BalanceResponse>('/account/balance'),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const balance = data ? parseFloat(data.balance) : 0;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      if (error.status === 401) {
        // If the session expired, return to the card insertion screen
        void router.push('/card');
      }
    }
  }, [isError, error, toast, router]);

  return (
    <ATMLayout cardNetwork={cardNetwork}>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        textAlign="center"
      >
        <Box pb={10}>
          <Text color="white" mb={2} textStyle="atmScreenTitle">
            Current Balance
          </Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <Text textStyle="atmScreenTitle" color="white" mb={2}>
              {formatted}
            </Text>
          )}
        </Box>
        <Stack spacing={3} mt={4} textStyle="atmScreenLabel">
          <Button onClick={() => void router.push('/menu')} colorScheme="teal">
            Back to Menu
          </Button>
          <Button onClick={() => void refetch()} colorScheme="blue" variant="outline">
            Refresh
          </Button>
        </Stack>
      </Box>
    </ATMLayout>
  );
};

export default BalanceView;
