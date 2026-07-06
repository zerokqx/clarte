import { createContext } from 'react';

export type ItemType = HTMLSpanElement;

export interface BottomNavigationContext {
  getRef: (name: string) => ItemType | undefined;
  registerRef: (name: string, ref: ItemType) => void;
  unregisterRef: (name: string) => void;
}
export const BottomNavigationContext = createContext<BottomNavigationContext | undefined>(
  undefined,
);
