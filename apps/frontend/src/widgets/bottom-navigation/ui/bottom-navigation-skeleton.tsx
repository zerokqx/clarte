import { Affix, Group, rem, Skeleton } from '@mantine/core';
import { affixPropsConstants } from '../constants';

export const BottomNavigationSkeleton = () => {
  return (
    <Affix {...affixPropsConstants}>
      <Group
        bdrs={'xl'}
        justify="space-around"
        bg={'var(--mantine-color-body)'}
        w={'100%'}
        pl={'md'}
        pr={'md'}
        h={rem(60)}
        style={{
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Skeleton circle h={rem(36)} w={rem(36)} />
        <Skeleton circle h={rem(44)} w={rem(44)} />
        <Skeleton circle h={rem(36)} w={rem(36)} />
      </Group>
    </Affix>
  );
};

