import { Observable } from 'rxjs';

export interface INoteClient {
  getBytes(id: string): Observable<Uint8Array>;
  checkAccess(authorId: string, noteId: string): Observable<boolean>;
  saveNoteBytes(id: string, authorId: string, bytes: Uint8Array): Observable<void>;
}
