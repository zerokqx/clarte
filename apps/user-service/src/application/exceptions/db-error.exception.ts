import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class DbError extends ProblemDetailsException {
  override type = '/errors/db-error';
  override title = 'Database operation failed';
  override status = 500;
}
