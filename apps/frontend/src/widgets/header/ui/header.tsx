import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './header.module.css';

interface HeaderProps {
  login: string;
  avatarUrl?: string;
}

export interface Header {
  Props: HeaderProps;
}

export const Header = ({ avatarUrl, login }: HeaderProps) => {
  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="xs">
        <Text size="lg" fw={800} style={{ letterSpacing: '-0.5px' }}>
          Clarte
        </Text>
      </Group>

      <UnstyledButton className={classes.profileButton}>
        <Group gap="sm">
          <Avatar src={avatarUrl} radius="xl" size="sm" color="violet" name={login} />
          <Text size="sm" fw={600} visibleFrom="xs">
            {login}
          </Text>
        </Group>
      </UnstyledButton>
    </Group>
  );
};
