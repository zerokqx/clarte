import {
  AppShell,
  NavLink,
  Title,
  Text,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconCheckbox,
  IconBell,
  IconUser,
  IconNote,
} from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

const navItems = [
  { to: ROUTES.dashboard, icon: IconLayoutDashboard, label: 'Дашборд' },
  { to: ROUTES.todos, icon: IconCheckbox, label: 'Задачи' },
  { to: ROUTES.notes, icon: IconNote, label: 'Заметки' },
  { to: ROUTES.notifications, icon: IconBell, label: 'Уведомления' },
  { to: ROUTES.profile, icon: IconUser, label: 'Профиль' },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <AppShell
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Box mb="lg">
          <Title order={3} fw={800}>
            Clarte
          </Title>
          <Text size="xs" c="dimmed">
            Рабочее пространство
          </Text>
        </Box>
        <Stack gap={4}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              component={RouterNavLink}
              to={to}
              label={label}
              leftSection={<Icon size={16} />}
              active={location.pathname === to}
              variant="filled"
              style={{ borderRadius: 8 }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
