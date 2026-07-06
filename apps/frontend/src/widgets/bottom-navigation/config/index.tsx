import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix';
import { LinkProps } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { BellIcon } from '@phosphor-icons/react/dist/icons/Bell';
import { ChecksIcon } from '@phosphor-icons/react/dist/csr/Checks';
import { HouseIcon } from '@phosphor-icons/react/dist/icons/House';

export interface BottomNavigationConfig {
  icon: ReactNode;
  to: Exclude<LinkProps['to'], undefined>;
  activeOptions?: LinkProps['activeOptions'];
}

export const bottomNavigationConfig: BottomNavigationConfig[] = [
  {
    icon: <BellIcon weight="fill" size={24} />,
    to: '/c/notifications',
  },

  {
    icon: <GearSixIcon weight="fill" size={24} />,
    to: '/c/settings',
  },
  {
    icon: <HouseIcon weight="fill" size={24} />,
    to: '/c',
    activeOptions: { exact: true },
  },

  {
    icon: <ChecksIcon weight="fill" size={24} />,
    to: '/c/todos',
  },
];
