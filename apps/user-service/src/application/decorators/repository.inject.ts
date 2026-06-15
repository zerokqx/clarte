import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '@/application/ports';
import { Fn } from '@clarte/shared-nest/functions';

export const InjectUserRepository = Fn.mkRepoInject(
  USER_WRITE_REPOSITORY,
  USER_READ_REPOSITORY,
);
