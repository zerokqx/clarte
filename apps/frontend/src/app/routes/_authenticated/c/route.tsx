import { useMe } from '@/entities/user';
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
  const { data } = useMe();

  return (
    <AppShell header={{ collapsed: !layoutStore.headerVisible, height: 50 }}>
      <AppShell.Header>
        <Header avatarUrl={data?.avatarUrl} login={data?.login ?? 'anonymous'} />
      </AppShell.Header>
      <AppShell.Main>
        <Spotlight />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
