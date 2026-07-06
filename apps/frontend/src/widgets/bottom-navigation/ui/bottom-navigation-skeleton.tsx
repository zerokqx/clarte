import { Affix, Group, rem, Skeleton } from '@mantine/core';
import { bottomNavigationConfig } from '../config';
import classes from './bottom-navigation.module.scss';

export const BottomNavigationSkeleton = () => {
  return (
    <Affix position={{ bottom: 0, left: 0, right: 0 }} zIndex={99}>
      <Group className={classes.bottomNavContainer}>
        {bottomNavigationConfig.map((_, index) => (
          <Skeleton key={index} h={rem(32)} w={rem(44)} radius="md" />
        ))}
      </Group>
    </Affix>
  );
};
