import { Title, Text } from '@mantine/core';

export function NotesPage() {
  return (
    <>
      <Title order={2} mb="xs">
        Заметки
      </Title>
      <Text c="dimmed">
        Совместное редактирование заметок будет доступно после интеграции Yjs.
      </Text>
    </>
  );
}
