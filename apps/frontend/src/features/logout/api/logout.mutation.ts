import { authStore } from '@/entities/session';
import { useAuthControllerLogout } from '@/shared/api/orval';

export const useLogout = () => {
  return useAuthControllerLogout({
    mutation: {
      onSuccess() {
        authStore.setAnonymous();
      },
    },
  });
};
