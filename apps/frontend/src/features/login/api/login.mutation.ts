import { useAuthControllerLogin } from '@clarte/shared-api/endpoints';

export const useLoginMutation = () => {
  return useAuthControllerLogin();
};
