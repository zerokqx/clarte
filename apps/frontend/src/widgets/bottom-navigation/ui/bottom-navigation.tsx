import { Group, Stack } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';
import { bottomNavigationConfig } from '../config';
import { BottomNavigationProvider } from '../model';
import { BottomNavigationItem } from './bottom-navigation-item';
import { Pill } from './pill';
import { SubActions } from './sub-actions';
import classes from './bottom-navigation.module.scss';

export const BottomNavigationRoot = () => {
  const { pinned } = useHeadroom({ fixedAt: 200 });

  console.log(pinned);
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: pinned ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.25s ease-in-out',
      }}
    >
      <Stack gap="xs">
        <Group id="bottom-nav-sub-actions" p="xs" className={classes.bottomNavSubActions} />
        <Group id="bottom-navigation-bar" className={classes.bottomNavContainer}>
          <BottomNavigationProvider>
            <Pill />
            {bottomNavigationConfig.map((item, index) => (
              <BottomNavigationItem key={index} to={item.to} activeOptions={item.activeOptions}>
                {item.icon}
              </BottomNavigationItem>
            ))}
          </BottomNavigationProvider>
        </Group>
      </Stack>
    </div>
  );
};

export const BottomNavigation = Object.assign(BottomNavigationRoot, { SubActions });
