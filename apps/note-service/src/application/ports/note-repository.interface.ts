import { Note } from '@/domain';
import { NoteReadModel } from '../models';

export interface INoteRepositoryWrite {
  save(note: Note): void;
}

export interface INoteRepositoryRead {
  findById(): NoteReadModel;
}
