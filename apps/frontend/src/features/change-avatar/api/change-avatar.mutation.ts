import { useQueryClient } from '@tanstack/react-query';
import {
  useUserEditControllerChangeAvatar,
  getUserControllerMeQueryKey,
} from '@clarte/shared-api/endpoints';
import type { UserMeDTO } from '@clarte/shared-api/model';
import { produce } from 'immer';

export const useChangeAvatar = () => {
  const queryClient = useQueryClient();

  return useUserEditControllerChangeAvatar({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: getUserControllerMeQueryKey() });

        const previousUser = queryClient.getQueryData<UserMeDTO>(getUserControllerMeQueryKey());

        if (previousUser) {
          queryClient.setQueryData<UserMeDTO>(
            getUserControllerMeQueryKey(),
            produce(previousUser, (draft) => {
              draft.avatarUrl = variables.data.avatarUrl;
            }),
          );
        }

        return { previousUser };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousUser) {
          queryClient.setQueryData<UserMeDTO>(getUserControllerMeQueryKey(), context.previousUser);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getUserControllerMeQueryKey() });
      },
    },
  });
};
