import { Note } from '@/domain';
import { NoteReadModel } from '../models';

export interface INoteRepositoryWrite {
  save(note: Note): Promise<void>;
}

export interface INoteRepositoryRead {
  findById(id: string): Promise<NoteReadModel|null>;
  getBytesFromNoteById(id: string) :Promise<Uint8Array | null>
}
