import { Observable } from 'rxjs';

export interface INoteAccessChecker {
  check(authorId: string, noteId: string): Observable<boolean>;
}
