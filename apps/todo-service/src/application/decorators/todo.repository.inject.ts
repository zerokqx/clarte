import { mkRepoInject } from '@clarte/shared-nest/functions';
import { TODO_REPO_READ, TODO_REPO_WRITE } from '../ports';

export const InjectTodoRepo = mkRepoInject(TODO_REPO_WRITE, TODO_REPO_READ);
