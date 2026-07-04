import { navbarItem } from './navbar-item.module.scss';
import { Group } from '@mantine/core';
import { ReactNode } from 'react';
import { useNavbar } from '../model';
import { Link } from '@tanstack/react-router';

export interface NavbarItemProps {
  leftSection?: ReactNode;
  to: string;
  name: string;
  children: string;
  onClick?: (name: string) => void;
}

export const NavbarItem = ({ leftSection, children, to, name, onClick }: NavbarItemProps) => {
  const { setWhatSelected } = useNavbar();
  return (
    <Link
      to={to}
      className={navbarItem}
      activeProps={{ 'data-selected': 'true' }}
      onClick={() => {
        setWhatSelected(name);
        onClick?.(name);
      }}
    >
      <Group gap="xs">
        {leftSection}
        {children}
      </Group>
    </Link>
  );
};
