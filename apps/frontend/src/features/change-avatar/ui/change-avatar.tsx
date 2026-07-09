import { Avatar, FileButton } from '@mantine/core';
import { useChangeAvatar } from '../api';
import axios from 'axios';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserStorageControllerGetPresignedUrlQueryOptions } from '@clarte/shared-api/endpoints';

interface ChangeAvatarProps {
  defaultValue?: string;
}

export const ChangeAvatar = ({ defaultValue }: ChangeAvatarProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: changeAvatar } = useChangeAvatar();
  const [value, setValue] = useState(defaultValue);
  return (
    <FileButton
      onChange={async (file) => {
        if (!file) return;
        const presigned = await queryClient.fetchQuery(
          getUserStorageControllerGetPresignedUrlQueryOptions(),
        );
        await axios.put(presigned.urlPresigned, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        await changeAvatar({ data: { avatarUrl: presigned.urlPublic } });
        setValue(presigned.urlPublic);
      }}
    >
      {(props) => <Avatar size={'xl'} src={value} {...props} />}
    </FileButton>
  );
};
