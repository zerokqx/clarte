import { Affix, Group, rem, Skeleton } from '@mantine/core';
import { affixPropsConstants } from '../constants';
import { M } from '@/shared/lib/mantine';

export const BottomNavigationSkeleton = () => {
  return (
    <Affix {...affixPropsConstants}>
      <Group
        bdrs={'xl'}
        justify="space-around"
        bg={M.body()}
        w={'100%'}
        pl={'md'}
        pr={'md'}
        h={rem(60)}
        style={{
          boxShadow: M.boxShadow(0)(10)(20)('rgba(0,0,0,0.15)'),
        }}
      >
        <Skeleton circle h={rem(36)} w={rem(36)} />
        <Skeleton circle h={rem(44)} w={rem(44)} />
        <Skeleton circle h={rem(36)} w={rem(36)} />
      </Group>
    </Affix>
  );
};
