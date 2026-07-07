import { Portal } from '@mantine/core';
import { ReactNode } from 'react';

export interface BottomSubActionsProps {
  children: ReactNode;
}
export const BottomSubActions = ({ children }: BottomSubActionsProps) => {
  return <Portal target={'#bottom-nav-sub-actions'}>{children}</Portal>;
};
