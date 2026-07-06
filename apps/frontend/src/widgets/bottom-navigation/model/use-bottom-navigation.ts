import { use } from 'react';
import { BottomNavigationContext } from './bottom-navigation-context';

export const useBottomNavigation = () => {
  const context = use(BottomNavigationContext);
  if (!context) throw new Error('Context is not defined [BottomNavigation]');
  return context;
};
