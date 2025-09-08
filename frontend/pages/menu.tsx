import React from 'react';
import { useAuthGuard } from '@hooks/useAuthGuard';
import Menu from '@features/menu/Menu';

const MenuPage: React.FC = () => {
  useAuthGuard();
  return <Menu />;
};

export default MenuPage;
