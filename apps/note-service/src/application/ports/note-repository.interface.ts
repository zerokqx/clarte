import type { CrqsRepository } from '@clarte/shared-nest/types';
import { Note } from '@/domain';
import { NoteReadModel } from '../models';

export interface INoteRepositoryWrite {
  save(note: Note): Promise<void>;
  findById(id: string): Promise<Note | null>;
}

export interface INoteRepositoryRead {
  findById(id: string): Promise<NoteReadModel | null>;
  getBytesFromNoteById(id: string): Promise<Uint8Array | null>;
  userHasAccessTo(userId: string): (noteId: string) => Promise<boolean>;
}

export type INoteRepository = CrqsRepository<INoteRepositoryRead, INoteRepositoryWrite>;
