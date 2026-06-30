import { useAuthControllerLogin } from '@/shared/api/orval';

export const useLoginMutation = () => {
  return useAuthControllerLogin();
};
