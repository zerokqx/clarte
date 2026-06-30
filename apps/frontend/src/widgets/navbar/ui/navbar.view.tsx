import { Divider, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { NavbarItem } from './navbar-item';
import { NavbarProvider } from '../model';

export interface NavbarProps {
  children: ReactNode;
}

const NavbarRoot = ({ children }: NavbarProps) => {
  return (
    <NavbarProvider>
      <Stack h={'100%'}>{children}</Stack>
    </NavbarProvider>
  );
};

const TopSection = ({ children }: { children: ReactNode }) => (
  <Stack w="100%">
    {children}
    <Divider />
  </Stack>
);

const DownSection = ({ children }: { children: ReactNode }) => (
  <Stack w="100%">
    <Divider />
    {children}
  </Stack>
);

const Body = ({ children }: { children: ReactNode }) => (
  <Stack h={'100%'} style={{ flexGrow: 1 }}>{children}</Stack>
);

export const Navbar = Object.assign(NavbarRoot, {
  Item: NavbarItem,
  Top: TopSection,
  Down: DownSection,
  Body,
});
