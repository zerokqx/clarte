import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class NoteNotFoundException extends ProblemDetailsException {
  override type = '/errors/note-not-found';
  override status = 404;
  override title = 'Note not found';
}
