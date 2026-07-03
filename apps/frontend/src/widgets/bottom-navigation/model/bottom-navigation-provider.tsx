import { BottomNavigationContext, ItemType } from './bottom-navigation-context';
import { ReactNode, useCallback, useMemo, useRef } from 'react';

interface BottomNavigationProviderProps {
  children: ReactNode;
}
export const BottomNavigationProvider = ({ children }: BottomNavigationProviderProps) => {
  const refsMap = useRef<Map<string, ItemType>>(new Map());

  const getRef = useCallback<BottomNavigationContext['getRef']>(
    (name) => refsMap.current.get(name),
    [],
  );
  const registerRef = useCallback<BottomNavigationContext['registerRef']>(
    (name, ref) => void refsMap.current.set(name, ref),
    [],
  );

  const unregisterRef = useCallback<BottomNavigationContext['unregisterRef']>(
    (name) => void refsMap.current.delete(name),
    [],
  );

  const value = useMemo<BottomNavigationContext>(
    () => ({ unregisterRef, registerRef, getRef }),
    [unregisterRef, registerRef, getRef],
  );

  return <BottomNavigationContext value={value}>{children}</BottomNavigationContext>;
};
