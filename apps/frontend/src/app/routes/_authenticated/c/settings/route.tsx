import { UserIcon } from '@phosphor-icons/react/dist/csr/User';
import { PaletteIcon } from '@phosphor-icons/react/dist/csr/Palette';
import { Box, Tabs } from '@mantine/core';
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/c/settings')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/c/settings' || location.pathname === '/c/settings/')
      throw redirect({ to: '/c/settings/theme' });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleOnChange = (value: string | null) => {
    if (!value) return;
    navigate({ to: `/c/settings/${value}` });
  };
  const currentTab = location.pathname.split('/').pop() as string;

  return (
    <Tabs value={currentTab} onChange={handleOnChange} orientation="vertical">
      <Tabs.List>
        <Tabs.Tab leftSection={<PaletteIcon weight="bold" size={16} />} value="theme">
          Тема
        </Tabs.Tab>

        <Tabs.Tab leftSection={<UserIcon weight="bold" size={16} />} value="account">
          Аккаунт
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={currentTab}>
        <Box p={'xs'}>
          <Outlet />
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
