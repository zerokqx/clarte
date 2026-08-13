import { Menu } from '@mantine/core';

export const NoteContextMenu = () => {
  return (
    <Menu trigger="click">
      <Menu.Item>Удалить</Menu.Item>
      <Menu.Item>Переименовать</Menu.Item>
    </Menu>
  );
};
