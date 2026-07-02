import { SidebarIcon } from '@phosphor-icons/react/dist/csr/Sidebar';
import { ActionIcon, Avatar, Group, Skeleton, Text, UnstyledButton } from '@mantine/core';
import classes from './header.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { lazy, Suspense } from 'react';

export interface HeaderViewProps {
  login: string;
  avatarUrl?: string;
  navbarVisible?: boolean;
  isLoading?: boolean;
  onToggleNavbar?: () => void;
}

const LazyNotificationsPopover = lazy(() =>
  import('@/features/show-notifications').then((m) => ({ default: m.NotificationPopover })),
);

export const HeaderView = ({
  avatarUrl,
  login,
  navbarVisible,
  isLoading,
  onToggleNavbar,
}: HeaderViewProps) => {
  const isMobile = useMediaQuery('(max-width: 48em)');
  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="xs">
        <ActionIcon variant={navbarVisible ? 'filled' : 'transparent'} onClick={onToggleNavbar}>
          <SidebarIcon weight="duotone" />
        </ActionIcon>
        <Text size="lg" fw={800} style={{ letterSpacing: '-0.5px' }}>
          Clarte
        </Text>
      </Group>

      <Group gap="sm">
        {!isMobile && (
          <Suspense fallback={<Skeleton circle width={28} height={28} />}>
            <LazyNotificationsPopover />
          </Suspense>
        )}
        <UnstyledButton className={classes.profileButton}>
          <Group gap="sm">
            {isLoading ? (
              <>
                <Skeleton circle height={28} width={28} />
                <Skeleton height={14} width={60} radius="xl" visibleFrom="xs" />
              </>
            ) : (
              <>
                <Avatar src={avatarUrl} radius="xl" size="sm" color="violet" name={login} />
                <Text size="sm" fw={600} visibleFrom="xs">
                  {login}
                </Text>
              </>
            )}
          </Group>
        </UnstyledButton>
      </Group>
    </Group>
  );
};
