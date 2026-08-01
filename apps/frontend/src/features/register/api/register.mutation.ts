import { useAuthControllerRegister } from '@clarte/shared-api/endpoints';

export const useRegisterMutation = () => {
  return useAuthControllerRegister();
};
