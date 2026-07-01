import {ChecksIcon} from "@phosphor-icons/react/dist/csr/Checks"
import { BrowserIcon } from '@phosphor-icons/react/dist/csr/Browser';
import { ReactNode } from 'react';
import { BottomNavigationItemProps } from '../ui/bottom-navigation-item';
import { spotlight } from '@mantine/spotlight';
import { BellIcon } from '@phosphor-icons/react/dist/icons/Bell';

interface BottomNavigationConfig extends Pick<BottomNavigationItemProps, 'variant'> {
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
}
export const bottomNavigatioonConfig: BottomNavigationConfig[] = [
  {
    icon: <BellIcon weight="bold" width={20} />,
    to: '/c/notifications',
  },
  {
    variant: 'accent',
    icon: <BrowserIcon weight="bold" width={20} />,
    onClick: spotlight.open,
  },

  {
    icon: <ChecksIcon weight="bold" width={20} />,
      to:"/c/todos"
  },
];
