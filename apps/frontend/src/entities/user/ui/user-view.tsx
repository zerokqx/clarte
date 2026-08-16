import { Fn } from '@clarte/shared';
import { Avatar, Group, Skeleton, Text, UnstyledButton } from '@mantine/core';

export interface UserViewProps {
  login: string;
  avatarUrl?: string;
  isLoading?: boolean;
  onClick?: Fn<[], void>;
}

export const UserView = ({ login, avatarUrl, isLoading, onClick }: UserViewProps) => {
  return (
    <UnstyledButton onClick={onClick}>
      <Group gap="sm">
        {isLoading ? (
          <>
            <Skeleton circle height={28} width={28} />
            <Skeleton height={14} width={60} radius="xl" visibleFrom="xs" />
          </>
        ) : (
          <>
            <Avatar
              src={avatarUrl}
              radius="xl"
              size="sm"
              color="violet"
              name={login}
              imageProps={{ fetchPriority: 'high' }}
            />
            <Text size="sm" fw={600} visibleFrom="xs">
              {login}
            </Text>
          </>
        )}
      </Group>
    </UnstyledButton>
  );
};
