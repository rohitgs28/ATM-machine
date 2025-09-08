import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@api/client';
import type { MoneyMutationResponse } from '@models/index';
import type { HttpError } from '@utils/errors';

/**
 * Returns a React Query mutation that performs a withdraw request and refreshes cached balance.
 *
 * @param {(data: MoneyMutationResponse) => void} [onSuccess]
 * @param {(error: HttpError) => void} [onError]
 * @returns  Mutation object.
 */

export function useWithdraw(
  onSuccess?: (data: MoneyMutationResponse) => void,
  onError?: (error: HttpError) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<MoneyMutationResponse, HttpError, number>({
    mutationFn: async (amount: number) => {
      const body = { amount, idempotencyKey: crypto.randomUUID() };
      return api<MoneyMutationResponse>('/account/withdraw', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
