import { Popover, ActionIcon, rem } from '@mantine/core';
import { BellIcon } from '@phosphor-icons/react/dist/csr/Bell';
import { NotificationsList } from './notifications-list';
import { useState } from 'react';

export const NotificationPopover = () => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      offset={30}
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => setOpened((o) => !o)}
          aria-label="Уведомления"
        >
          <BellIcon size={20} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        p={0}
        style={{
          width: rem(360),
          maxHeight: rem(360),
          overflowY: 'auto',
        }}
      >
        <NotificationsList />
      </Popover.Dropdown>
    </Popover>
  );
};
