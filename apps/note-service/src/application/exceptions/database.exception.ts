import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class DatabaseException extends ProblemDetailsException {
  override type = '/errors/database-error';
  override name = DatabaseException.name;
  override status = 500;
  override title = 'Database Error';
}
