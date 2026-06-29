import { layoutStore } from '@/shared/model';
import { Header } from '@/widgets/header';
import { Spotlight } from '@/widgets/spotlight';
import { AppShell } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

export const Route = createFileRoute('/_authenticated/c')({
  component: observer(RouteComponent),
});

function RouteComponent() {
  return (
    <AppShell
      header={{ collapsed: !layoutStore.headerVisible, height: 50 }}
      navbar={{
        collapsed: { desktop: !layoutStore.navbarVisible, mobile: !layoutStore.navbarVisible },
        width: 300,
        breakpoint: 'xs',
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>dwdwdawdawdadawdaw</AppShell.Navbar>
      <AppShell.Main>
        <Spotlight />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
