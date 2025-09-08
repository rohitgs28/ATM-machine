import { useMutation } from '@tanstack/react-query';
import { api } from '@api/client';
import type { HttpError } from '@utils/errors';

/**
 * Provides a mutation for logging out the current session.
 *
 * @param onSuccess callback fired after a successful logout
 * @param onError callback fired when the logout fails
 */
export function useLogout(
  onSuccess?: () => void,
  onError?: (error: HttpError) => void,
): ReturnType<typeof useMutation<void, HttpError, void>> {
  return useMutation<void, HttpError, void>(
    async () => {
      await api('/auth/logout', { method: 'POST' });
    },
    {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        if (onError) onError(error);
      },
    },
  );
}
