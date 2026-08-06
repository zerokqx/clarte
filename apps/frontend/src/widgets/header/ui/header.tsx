import { SidebarIcon } from '@phosphor-icons/react/dist/csr/Sidebar';
import { ActionIcon, Group, Skeleton, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { lazy, Suspense } from 'react';
import { M } from '@clarte/mantine-helpers';
import { observer } from 'mobx-react-lite';
import { layoutStore } from '@/shared/model';

const LazyNotificationsPopover = lazy(() =>
  import('@/features/show-notifications').then((m) => ({ default: m.NotificationPopover })),
);

export const Header = observer(() => {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="xs">
        <ActionIcon
          visibleFrom="xs"
          variant={layoutStore.navbarVisible ? 'filled' : 'transparent'}
          onClick={() => layoutStore.toggleNavbar()}
        >
          <SidebarIcon weight="duotone" />
        </ActionIcon>
        <Text c={M.primary()} size="lg" fw={800} style={{ letterSpacing: '-0.5px' }}>
          Clarte
        </Text>
      </Group>

      <Group gap="sm">
        {!isMobile && (
          <Suspense fallback={<Skeleton circle width={28} height={28} />}>
            <LazyNotificationsPopover />
          </Suspense>
        )}
      </Group>
    </Group>
  );
});
