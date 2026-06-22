import { mkRepoInject } from '@clarte/shared-nest/functions';
import { NOTE_READ_REPO, NOTE_WRITE_REPO } from '../ports';
export const InjectNoteRepo = mkRepoInject(NOTE_READ_REPO, NOTE_WRITE_REPO);
