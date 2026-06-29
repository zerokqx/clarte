import { useAuthControllerRegister } from '@/shared/api/orval';

export const useRegisterMutation = () => {
  return useAuthControllerRegister();
};
