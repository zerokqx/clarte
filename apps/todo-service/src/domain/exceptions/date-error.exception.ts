import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class DateException extends ProblemDetailsException {
  override type = '/errors/date-error';
  override title = 'Date Error';
  override status = 400;
}
