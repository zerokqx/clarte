import { layoutStore } from '@/shared/model';
import { Header } from '@/widgets/header';
import { Navbar } from '@/widgets/navbar';
import { Spotlight } from '@/widgets/spotlight';
import { ZenModeIndicator } from '@/widgets/zen-mode-indicator'; import { AppShell, Button, useMantineColorScheme } from '@mantine/core';
import { LayoutIcon } from '@phosphor-icons/react/dist/icons/Layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

export const Route = createFileRoute('/_authenticated/c')({
  component: observer(RouteComponent),
});

function RouteComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
          <Navbar.Down>Down</Navbar.Down>
        </Navbar>
      </AppShell.Navbar>
      <AppShell.Main>
      <ZenModeIndicator/>
        <Button onClick={() => toggleColorScheme()}>Change theme</Button>

        <Button onClick={() => layoutStore.toggleZenMode()}>Change zen</Button>
        <Spotlight />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
