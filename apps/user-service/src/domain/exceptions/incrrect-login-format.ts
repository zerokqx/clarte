import { ProblemDetailsException } from '@clarte/shared-domain';

export class IncorrectLoginFormatError extends ProblemDetailsException {
  override type = '/errors/incorrect-login-format';
  override title = 'Incorrect login format';
  override status = 400;
}
