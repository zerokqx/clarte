import { M } from '@clarte/mantine-helpers';
import { layoutStore } from '@/shared/model';
import { BottomNavigationSkeleton } from '@/widgets/bottom-navigation/ui/bottom-navigation-skeleton';
import { Header } from '@/widgets/header';
import { Spotlight } from '@/widgets/spotlight';
import { AppShell, Skeleton, Stack } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import { ThemeToggle } from '@/features/theme-toggle';
import { ZenModeIndicator } from '@/widgets/zen-mode-indicator';

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
      padding="md"
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
          <ThemeToggle />
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
