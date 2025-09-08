import React from 'react';
import { useAuthGuard } from '@hooks/useAuthGuard';
import WithdrawForm from '@features/withdraw/WithdrawForm';

/**
 * Page wrapper for the Withdraw feature.  Ensures the user is
 * authenticated before displaying the withdraw form.  Redirects to
 * the card entry page when unauthenticated via the useAuthGuard hook.
 */
const WithdrawPage: React.FC = () => {
  useAuthGuard();
  return <WithdrawForm />;
};

export default WithdrawPage;
