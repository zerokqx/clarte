import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { ROUTES } from '@/shared/config';
import { useAuthControllerLogin } from '@/shared/api/generated/auth/auth';
import type { LoginDTO } from '@/shared/api/generated/model';

export interface LoginFormValues {
  login: string;
  password: string;
}

export function useLoginFeature() {
  const navigate = useNavigate();

  const mutation = useAuthControllerLogin({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Добро пожаловать!',
          message: 'Вы успешно вошли в систему',
          color: 'teal',
        });
        navigate(ROUTES.dashboard);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка входа',
          message: 'Неверный логин или пароль',
          color: 'red',
        });
      },
    },
  });

  const submit = (values: LoginFormValues) => {
    mutation.mutate({ data: values as LoginDTO });
  };

  return {
    submit,
    isPending: mutation.isPending,
  };
}
