import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@api/client';
import type { MoneyMutationResponse } from '@models/index';
import type { HttpError } from '@utils/errors';

/**
 * Custom hook that performs a deposit mutation against the `/account/deposit`
 * endpoint.
 *
 * @param onSuccess callback invoked with the server response upon success
 * @param onError callback invoked when the mutation fails
 */
export function useDeposit(
  onSuccess?: (data: MoneyMutationResponse) => void,
  onError?: (error: HttpError) => void,
): ReturnType<typeof useMutation<MoneyMutationResponse, HttpError, number>> {
  const queryClient = useQueryClient();
  return useMutation<MoneyMutationResponse, HttpError, number>(
    async (amount: number) => {
      const body = {
        amount,
        idempotencyKey: crypto.randomUUID(),
      };
      return api<MoneyMutationResponse>('/account/deposit', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    {
      onSuccess: (data) => {
        // Invalidate the balance query to refresh the user's balance
        queryClient.invalidateQueries(['balance']);
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    },
  );
}
