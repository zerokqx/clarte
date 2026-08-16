import { Menu } from '@mantine/core';

interface NoteContextMenuProps {
  noteId?: string;
}
export const NoteContextMenu = ({ noteId }: NoteContextMenuProps) => {
  return (
    <Menu trigger="click">
      <Menu.Item>Удалить</Menu.Item>
      <Menu.Item>Переименовать</Menu.Item>
    </Menu>
  );
};
