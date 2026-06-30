import { navbarItem } from './navbar-item.module.css';
import { Group } from '@mantine/core';
import { ReactNode } from 'react';
import { useNavbar } from '../model';

export interface NavbarItemProps {
  leftSection?: ReactNode;
  name: string;
  children: string;
  onClick?: (name: NavbarItemProps['name']) => void;
}

export const NavbarItem = ({ leftSection, children, name, onClick }: NavbarItemProps) => {
  const { whatSelected, setWhatSelected } = useNavbar();
  return (
    <Group
      pl={'sm'}
      data-selected={whatSelected === name}
      className={navbarItem}
      onClick={() => {
        setWhatSelected(name);
        onClick?.(name);
      }}
    >
      {leftSection}
      {children}
    </Group>
  );
};
