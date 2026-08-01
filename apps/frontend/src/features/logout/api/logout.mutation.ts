import { authStore } from '@/entities/session';
import { useAuthControllerLogout } from '@clarte/shared-api/endpoints';

export const useLogout = () => {
  return useAuthControllerLogout({
    mutation: {
      onSuccess() {
        authStore.setAnonymous();
      },
    },
  });
};
