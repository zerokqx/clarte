import { useUserEditControllerChangeAvatar } from '@/shared/api/orval';

export const useChangeAvatar = () =>
  useUserEditControllerChangeAvatar({
    mutation: {},
  });
