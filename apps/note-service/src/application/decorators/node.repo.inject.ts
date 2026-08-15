import { mkRepoInject } from '@clarte/shared-nest/functions';
import { NODE_READ_REPO, NODE_WRITE_REPO } from '../ports';

export const InjectNodeRepo = mkRepoInject(NODE_WRITE_REPO, NODE_READ_REPO);
export const InjectNoteRepo = InjectNodeRepo;
