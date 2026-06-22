import { Observable } from 'rxjs';
import { Auth, Notes } from '@clarte/shared-contracts/proto';

export interface INoteClient {
  getBytes(id: string): Observable<Uint8Array>;
  getNoteById(id: string): Observable<Notes.Note>;
  saveNoteBytes(
    id: string,
    authorId: string,
    bytes: Uint8Array,
  ): Observable<void>;

  checkAccess(
    authorId: string,
    noteId: string,
  ): Observable<Notes.AccessCheckResponse>;
}
