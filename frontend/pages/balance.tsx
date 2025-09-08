import React from 'react';
import { useAuthGuard } from '@hooks/useAuthGuard';
import BalanceView from '@features/balance/BalanceView';

const BalancePage: React.FC = () => {
  useAuthGuard();
  return <BalanceView />;
};

export default BalancePage;
