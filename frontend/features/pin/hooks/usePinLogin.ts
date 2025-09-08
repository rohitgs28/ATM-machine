import { useMutation } from '@tanstack/react-query';
import { api } from '@api/client';
import type { HttpError } from '@utils/errors';
import type { PinLoginResponse } from '@models/index';


export interface PinLoginArgs {
  pin: string;
  cardToken?: string | null;
}

/**
 * Hook that performs PIN authentication by calling `/auth/pin`.
 *
 * @param onSuccess called with the authenticated user info on success
 * @param onError called when the server returns an error
 */
export function usePinLogin(
  onSuccess?: (data: PinLoginResponse) => void,
  onError?: (error: HttpError) => void,
): ReturnType<typeof useMutation<PinLoginResponse, HttpError, PinLoginArgs>> {
  return useMutation<PinLoginResponse, HttpError, PinLoginArgs>(
    async ({ pin, cardToken }) => {
      const body: Record<string, unknown> = { pin };
      if (cardToken) {
        body.cardToken = cardToken;
      }
      return api<PinLoginResponse>('/auth/pin', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    {
      onSuccess: (data: PinLoginResponse) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error: HttpError) => {
        if (onError) onError(error);
      },
    },
  );
}
