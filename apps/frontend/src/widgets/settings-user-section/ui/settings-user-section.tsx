import { useMe } from '@/entities/user';
import { ChangeAvatar } from '@/features/change-avatar';
import { ChangeLogin } from '@/features/change-login';
import { Center, Loader, Stack } from '@mantine/core';

export const SettingsUserSection = () => {
  const { data: user, isLoading } = useMe();
  if (isLoading)
    return (
      <Center>
        <Loader size="md" />{' '}
      </Center>
    );
  return (
    <Stack justify="center">
      <Center>
        <ChangeAvatar defaultValue={user?.avatarUrl} />
      </Center>
      <ChangeLogin defaultValue={user?.login} />
    </Stack>
  );
};
