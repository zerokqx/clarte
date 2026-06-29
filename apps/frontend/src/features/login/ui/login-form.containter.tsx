import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { AxiosError } from 'axios';
import { authStore } from '@/entities/session';
import { loginStore } from '../model';
import { useLoginMutation } from '../api';
import { LoginFormState, LoginFormView } from './login-form.view';

interface LoginFormContainerProps {
  onSuccess?: () => void;
}

export const LoginForm = observer(({ onSuccess }: LoginFormContainerProps) => {
  const { mutateAsync, isPending } = useLoginMutation();
  const [rootError, setRootError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<LoginFormState> = async (data) => {
    try {
      setRootError(null);
      await mutateAsync({ data });
      
      // Обновляем состояние авторизации и последнего входа
      authStore.setAuthenticated();
      loginStore.setLastLogin(data.login);
      
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.details || errorData?.message || 'Произошла ошибка при входе';
        setRootError(errorMessage);
      } else {
        setRootError('Что-то пошло не так');
      }
    }
  };

  return (
    <LoginFormView
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      lastLoginName={loginStore.lastLogin}
      rootError={rootError}
    />
  );
});
