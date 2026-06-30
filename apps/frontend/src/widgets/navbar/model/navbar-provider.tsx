import { ReactNode, useMemo, useState } from 'react';
import { NavbarContext } from './navbar-context';

export interface NavbarProviderProps {
  initialSelected?: string;
  children?: ReactNode;
}
export interface NavbarProvider {
  Props: NavbarProviderProps;
}

export const NavbarProvider = ({ initialSelected, children }: NavbarProvider['Props']) => {
  const [whatSelected, setWhatSelected] = useState(initialSelected);
  const value = useMemo<NavbarContext>(() => ({ whatSelected, setWhatSelected }), [whatSelected]);

  return <NavbarContext.Provider value={value} children={children} />;
};
