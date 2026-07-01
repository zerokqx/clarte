import { LogoutButton } from '@/features/logout';
import { M } from '@/shared/lib/mantine';
import { layoutStore } from '@/shared/model';
import { BottomNavigationSkeleton } from '@/widgets/bottom-navigation';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import { Spotlight } from '@/widgets/spotlight';
import { ZenModeIndicator } from '@/widgets/zen-mode-indicator';
import { AppShell, Stack } from '@mantine/core';
import { LayoutIcon } from '@phosphor-icons/react/dist/icons/Layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';

const LazyBottomNavigation = lazy(() =>
  import('@/widgets/bottom-navigation').then((m) => ({ default: m.BottomNavigation })),
);
export const Route = createFileRoute('/_authenticated/c')({
  component: observer(RouteComponent),
});

function RouteComponent() {
  const isMobile = M.useBreakpointMediaQuery('max-width','xs');
  return (
    <AppShell
      padding="md"
      header={{ collapsed: !layoutStore.headerVisible, height: 50 }}
      navbar={{
        collapsed: { desktop: !layoutStore.navbarVisible, mobile: !layoutStore.navbarVisible },
        width: 300,
        breakpoint: 'xs',
      }}
    >
      <Spotlight />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar>
          <Navbar.Top>Top</Navbar.Top>
          <Navbar.Body>
            <Navbar.Item name="1" leftSection={<LayoutIcon />}>
              Item
            </Navbar.Item>
            <Navbar.Item name="2">Item</Navbar.Item>
            <Navbar.Item name="3">Item</Navbar.Item>
          </Navbar.Body>
          <Navbar.Down>
            <LogoutButton />
          </Navbar.Down>
        </Navbar>
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="md">
          <ZenModeIndicator />
          {isMobile && (
            <Suspense fallback={<BottomNavigationSkeleton />}>
              <LazyBottomNavigation />
            </Suspense>
          )}
          <Outlet />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
