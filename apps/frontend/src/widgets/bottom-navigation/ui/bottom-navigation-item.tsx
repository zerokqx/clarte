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
      bg={'var(--mantine-color-body)'}
      size={'xl'}
      bdrs={'xl'}
      style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
      onClick={onClick}
      {...(variant === 'accent' && {
        size: 'input-xl',
        pos: 'relative',
        top: rem(-20),
        bd: '4px solid var(--mantine-primary-color-8)',
      })}
    >
      {children}
    </ActionIcon>
  );
};
