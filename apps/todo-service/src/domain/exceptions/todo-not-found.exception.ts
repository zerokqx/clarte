import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class TodoNotFoundException extends ProblemDetailsException {
  override type = '/errors/todo-not-found';
  override title = 'Todo not found';
  override status = 404;
}
