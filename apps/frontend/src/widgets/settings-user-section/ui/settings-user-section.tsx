import { useMe } from '@/entities/user';
import { ChangeAvatar } from '@/features/change-avatar';
import { ChangeLogin } from '@/features/change-login';
import { Center, Stack } from '@mantine/core';

export const SettingsUserSection = () => {
  const { data: user } = useMe();
  return (
    <Stack justify="center">
      <Center>
        <ChangeAvatar defaultValue={user?.avatarUrl} />
      </Center>
      <ChangeLogin defaultValue={user?.login} />
    </Stack>
  );
};
