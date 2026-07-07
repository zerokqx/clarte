import classes from './navbar-item.module.scss';
import { Divider, Group, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { NavbarItem } from './navbar-item';
import { NavbarProvider } from '../model';

export interface NavbarProps {
  children: ReactNode;
}

const NavbarRoot = ({ children }: NavbarProps) => {
  return (
    <NavbarProvider>
      <Stack className={classes.navbar} h={'100%'}>
        {children}
      </Stack>
    </NavbarProvider>
  );
};

const TopSection = ({ children }: { children: ReactNode }) => (
  <Stack gap={0} mt={'auto'} w={'100%'}>
    <Group w="100%" align="center" p={'xs'} justify="start">
      {children}
    </Group>
    <Divider />
  </Stack>
);

const DownSection = ({ children }: { children: ReactNode }) => (
  <Stack gap={0} mt={'auto'} w={'100%'}>
    <Divider />
    <Group w="100%" align="center" p={'xs'} justify="start">
      {children}
    </Group>
  </Stack>
);

const Body = ({ children }: { children: ReactNode }) => (
  <Stack gap={0} h={'100%'} style={{ flexGrow: 1 }}>
    {children}
  </Stack>
);

export const Navbar = Object.assign(NavbarRoot, {
  Item: NavbarItem,
  Top: TopSection,
  Down: DownSection,
  Body,
});
