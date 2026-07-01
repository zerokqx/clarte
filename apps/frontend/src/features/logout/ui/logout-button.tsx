import { Button } from '@mantine/core';
import { useLogout } from '../api';

export const LogoutButton = () => {
  const { mutateAsync } = useLogout();

  return (
    <Button
      onClick={async () => {
        await mutateAsync();
      }}
    >Logout</Button>
  );
};
