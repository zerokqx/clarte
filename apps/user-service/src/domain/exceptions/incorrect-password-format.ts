import { ProblemDetailsException } from '@clarte/shared-domain';

export class IncorrectPasswordFormatError extends ProblemDetailsException {
  override type = '/errors/incorrect-password-format';
  override title = 'Incorrect password format';
  override status = 400;
}
