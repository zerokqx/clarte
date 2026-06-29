import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { AxiosError } from 'axios';
import { authStore } from '@/entities/session';
import { loginStore } from '@/features/login/model';
import { useRegisterMutation } from '../api';
import { RegisterFormState, RegisterFormView } from './register-form.view';

interface RegisterFormContainerProps {
  onSuccess?: () => void;
}

export const RegisterForm = observer(({ onSuccess }: RegisterFormContainerProps) => {
  const { mutateAsync, isPending } = useRegisterMutation();
  const [rootError, setRootError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<RegisterFormState> = async (data) => {
    try {
      setRootError(null);
      await mutateAsync({ data });
      
      // Авторизуем пользователя и сохраняем его логин в историю
      authStore.setAuthenticated();
      loginStore.setLastLogin(data.login);
      
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.details || errorData?.message || 'Произошла ошибка при регистрации';
        setRootError(errorMessage);
      } else {
        setRootError('Что-то пошло не так');
      }
    }
  };

  return (
    <RegisterFormView
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      rootError={rootError}
    />
  );
});
