import { LogoutButton } from '@/features/logout';
import { layoutStore } from '@/shared/model';
import { BottomNavigationSkeleton } from '@/widgets/bottom-navigation';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import { Spotlight } from '@/widgets/spotlight';
import { ZenModeIndicator } from '@/widgets/zen-mode-indicator';
import { Affix, AppShell, Button, Loader, useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
  const isMobile = useMediaQuery('(max-width: 48em)');
  return (
    <AppShell
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
        <ZenModeIndicator />
        {/* <Button onClick={() => toggleColorScheme()}>Change theme</Button> */}
        {/* <Button onClick={() => layoutStore.toggleZenMode()}>Change zen</Button> */}

        {isMobile && (
          <Suspense fallback={<BottomNavigationSkeleton />}>
            <LazyBottomNavigation />
          </Suspense>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
