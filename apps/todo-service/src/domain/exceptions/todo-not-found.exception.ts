import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class TodoNotFoundException extends ProblemDetailsException {
  override type = '/errors/todo-not-found';
  override title = 'Todo not found';
  override status = 404;

  constructor(detail = 'Todo not found', extensions?: Record<string, any>) {
    super(detail, extensions);
  }
}
