import { Title, Text, SimpleGrid, Paper, Group, ThemeIcon } from '@mantine/core';
import { IconCheckbox, IconBell, IconNote } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { TiptapDemo } from '@/features/tiptap-demo';

const cards = [
  {
    to: ROUTES.todos,
    icon: IconCheckbox,
    color: 'blue',
    title: 'Задачи',
    description: 'Управляйте своими задачами и дедлайнами',
  },
  {
    to: ROUTES.notes,
    icon: IconNote,
    color: 'violet',
    title: 'Заметки',
    description: 'Записывайте мысли и идеи',
  },
  {
    to: ROUTES.notifications,
    icon: IconBell,
    color: 'orange',
    title: 'Уведомления',
    description: 'Следите за важными событиями',
  },
];

export function DashboardPage() {
  return (
    <>
      <Title order={2} mb="xs">
        Добро пожаловать 👋
      </Title>
      <Text c="dimmed" mb="xl">
        Что хотите сделать сегодня?
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {cards.map(({ to, icon: Icon, color, title, description }) => (
          <Paper
            key={to}
            component={Link}
            to={to}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              textDecoration: 'none',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group gap="md">
              <ThemeIcon color={color} variant="light" size={44} radius="md">
                <Icon size={24} />
              </ThemeIcon>
              <div>
                <Text fw={600}>{title}</Text>
                <Text size="sm" c="dimmed">
                  {description}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <TiptapDemo />
    </>
  );
}

