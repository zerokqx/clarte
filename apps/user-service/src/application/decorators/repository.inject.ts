import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '../ports';
import { Fn } from '@clarte/shared-nest';

export const InjectUserRepository = Fn.mkRepoInject(
  USER_WRITE_REPOSITORY,
  USER_READ_REPOSITORY,
);
