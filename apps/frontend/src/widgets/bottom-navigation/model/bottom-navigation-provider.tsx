import { BottomNavigationContext, ItemType } from './bottom-navigation-context';
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';

interface BottomNavigationProviderProps {
  children: ReactNode;
}
export const BottomNavigationProvider = ({ children }: BottomNavigationProviderProps) => {
  const refsMap = useRef<Map<string, ItemType>>(new Map());
  const [, setTick] = useState(0);

  const getRef = useCallback<BottomNavigationContext['getRef']>(
    (name) => refsMap.current.get(name),
    [],
  );
  const registerRef = useCallback<BottomNavigationContext['registerRef']>((name, ref) => {
    if (refsMap.current.get(name) === ref) return;
    refsMap.current.set(name, ref);
    setTick((t) => t + 1);
  }, []);

  const unregisterRef = useCallback<BottomNavigationContext['unregisterRef']>((name) => {
    if (!refsMap.current.has(name)) return;
    refsMap.current.delete(name);
    setTick((t) => t + 1);
  }, []);

  const value = useMemo<BottomNavigationContext>(
    () => ({ unregisterRef, registerRef, getRef }),
    [unregisterRef, registerRef, getRef],
  );

  return <BottomNavigationContext value={value}>{children}</BottomNavigationContext>;
};
