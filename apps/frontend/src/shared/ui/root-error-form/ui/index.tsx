import { main } from './index.module.css';
import { Group, ThemeIcon, Text } from '@mantine/core';
import { WarningIcon } from '@phosphor-icons/react';

interface RootErrorFormProps {
  message?: string;
}
export const RootErrorForm = ({ message }: RootErrorFormProps) => {
  return (
    <Group className={main} gap="xs">
      <ThemeIcon variant="transparent" size={'sm'}>
        <WarningIcon size={28} weight="duotone" />
      </ThemeIcon>
      <Text size="sm" fw={500}>
        {message}
      </Text>
    </Group>
  );
};
