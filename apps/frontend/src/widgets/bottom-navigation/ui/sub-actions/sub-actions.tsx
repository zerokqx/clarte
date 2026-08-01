import { Portal } from '@mantine/core';
import { ReactNode } from 'react';
import { SubAction } from './action';

export interface SubActionsProps {
  children: ReactNode;
}
export const SubActionsRoot = ({ children }: SubActionsProps) => {
  return <Portal target={'#bottom-nav-sub-actions'}>{children}</Portal>;
};

export const SubActions = Object.assign(SubActionsRoot, { Action: SubAction });
