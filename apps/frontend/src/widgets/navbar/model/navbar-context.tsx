import { createContext } from 'react';

export interface NavbarContext {
  whatSelected: string | undefined;
  setWhatSelected: (nextSelected: string) => void;
}
export const NavbarContext = createContext<NavbarContext | undefined>(undefined);
