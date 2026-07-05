import { TextInput } from '@mantine/core';
import { useChangeLogin } from '../api/change-login.mutation';

export type ChangeLoginProps = Pick<TextInput.Props, 'defaultValue'>;
export const ChangeLogin = ({ defaultValue }: ChangeLoginProps) => {
  const { mutateAsync } = useChangeLogin();

  return (
    <TextInput
      defaultValue={defaultValue}
      onChange={async (e) => {
        mutateAsync({ data: { login: e.currentTarget.value } });
      }}
    />
  );
};
