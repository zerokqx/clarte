import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { ROUTES } from '@/shared/config';
import { useAuthControllerRegister } from '@/shared/api/generated/auth/auth';
import type { RegisterDTO } from '@/shared/api/generated/model';

export interface RegisterFormValues {
  login: string;
  password: string;
}

export function useRegisterFeature() {
  const navigate = useNavigate();

  const mutation = useAuthControllerRegister({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Аккаунт создан!',
          message: 'Теперь вы можете войти в систему',
          color: 'teal',
        });
        navigate(ROUTES.login);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка регистрации',
          message: 'Такой логин уже занят',
          color: 'red',
        });
      },
    },
  });

  const submit = (values: RegisterFormValues) => {
    mutation.mutate({ data: values as RegisterDTO });
  };

  return {
    submit,
    isPending: mutation.isPending,
  };
}
