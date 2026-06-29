import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useUnit } from 'effector-react';
import { AxiosError } from 'axios';
import { $lastLogin, lastLoginChanged, loginSuccesed } from '../model';
import { useLoginMutation } from '../api';
import { LoginFormState, LoginFormView } from './login-form.view';

interface LoginFormContainerProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormContainerProps) => {
  const [loginSuccesedFn, lastLoginChangedFn, lastLogin] = useUnit([
    loginSuccesed,
    lastLoginChanged,
    $lastLogin,
  ]);
  
  const { mutateAsync, isPending } = useLoginMutation();
  const [rootError, setRootError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<LoginFormState> = async (data) => {
    try {
      setRootError(null);
      await mutateAsync({ data });
      
      loginSuccesedFn();
      lastLoginChangedFn(data.login);
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
      lastLoginName={lastLogin}
      rootError={rootError}
    />
  );
};
