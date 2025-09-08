import React from 'react';
import { useAuthGuard } from '@hooks/useAuthGuard';
import DepositForm from '@features/deposit/DepositForm';

const DepositPage: React.FC = () => {
  useAuthGuard();
  return <DepositForm />;
};

export default DepositPage;
