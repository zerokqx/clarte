import { M } from '@clarte/mantine-helpers';
import { layoutStore } from '@/shared/model';
import { BottomNavigationSkeleton } from '@/widgets/bottom-navigation/ui/bottom-navigation-skeleton';
import { Header } from '@/widgets/header';
import { Spotlight } from '@/widgets/spotlight';
import { AppShell, Skeleton, Stack } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import { ZenModeIndicator } from '@/widgets/zen-mode-indicator';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { BrowserIcon } from '@phosphor-icons/react/dist/icons/Browser';
import { spotlight } from '@mantine/spotlight';

const LazyBottomNavigation = lazy(() =>
  import('@/widgets/bottom-navigation').then((m) => ({ default: m.BottomNavigation })),
);

const LazyNavbarContent = lazy(() =>
  import('./-navbar-content').then((m) => ({ default: m.NavbarContent })),
);

export const Route = createFileRoute('/_authenticated/c')({
  component: observer(RouteComponent),
});

function RouteComponent() {
  const isMobile = M.useBreakpointMediaQuery('max-width', 'xs');
  return (
    <AppShell
      padding="xs"
      header={{ collapsed: !layoutStore.headerVisible, height: 50 }}
      navbar={{
        collapsed: {
          desktop: isMobile || !layoutStore.navbarVisible,
          mobile: true,
        },
        width: 300,
        breakpoint: 'xs',
      }}
    >
      <Spotlight />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      {!isMobile && (
        <AppShell.Navbar>
          <Suspense fallback={<Skeleton height="100%" />}>
            <LazyNavbarContent />
          </Suspense>
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        <Stack gap="md">
          <ZenModeIndicator />
          {isMobile && (
            <Suspense fallback={<BottomNavigationSkeleton />}>
              <LazyBottomNavigation />

              <BottomNavigation.SubActions>
                <BottomNavigation.SubActions.Action>
                  <BrowserIcon onClick={spotlight.open} />
                </BottomNavigation.SubActions.Action>
              </BottomNavigation.SubActions>
            </Suspense>
          )}
          <Outlet />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
