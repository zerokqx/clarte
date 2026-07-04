import { Link, LinkProps } from '@tanstack/react-router';
import { ReactNode, useCallback } from 'react';
import classes from './bottom-navigation.module.css';
import { useBottomNavigation } from '../model';

export interface BottomNavigationItemProps {
  children: ReactNode;
  label?: string;
  to: NonNullable<LinkProps['to']>;
  activeOptions?: LinkProps['activeOptions'];
}

export const BottomNavigationItem = ({
  children,
  label,
  to,
  activeOptions,
}: BottomNavigationItemProps) => {
  console.log(classes)
  const bottomNavigation = useBottomNavigation();

  const handleRef = useCallback(
    (node: HTMLSpanElement | null) => {
      if (node) {
        bottomNavigation.registerRef(to, node);
      } else {
        bottomNavigation.unregisterRef(to);
      }
    },
    [to, bottomNavigation],
  );

  return (
    <Link
      to={to}
      activeOptions={activeOptions}
      className={classes.item}
      activeProps={{ 'data-active': '' }}
    >
      <span
        className={classes.icon}
        ref={handleRef}
      >
        {children}
      </span>
      {label && <span className={classes.label}>{label}</span>}
    </Link>
  );
};
