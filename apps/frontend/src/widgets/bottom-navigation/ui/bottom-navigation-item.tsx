import { M } from '@/shared/lib/mantine';
import { ActionIcon, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface BottomNavigationItemProps {
  children: ReactNode;
  variant?: 'accent' | ActionIcon.Props['variant'];
  onClick?: () => void;
}

export const BottomNavigationItem = ({ children, onClick, variant }: BottomNavigationItemProps) => {
  return (
    <ActionIcon
      c="bright"
      bg={M.body()}
      size={'xl'}
      bdrs={'xl'}
      style={{
        boxShadow: M.boxShadow(0)(10)(20)('rgba(0,0,0,0.15)'),
      }}
      onClick={onClick}
      {...(variant === 'accent' && {
        size: 'input-xl',
        pos: 'relative',
        top: rem(-20),
        bd: M.border(4)('solid')(M.primary(8)),
      })}
    >
      {children}
    </ActionIcon>
  );
};
