import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '@/application/ports';
import { mkRepoInject } from '@clarte/shared-nest/functions';

export const InjectUserRepository = mkRepoInject(
  USER_WRITE_REPOSITORY,
  USER_READ_REPOSITORY,
);
