import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class PasswordInvalidError extends ProblemDetailsException {
  override type = '/errors/password-invalid';
  override status = 400;
  override title = 'Password invalid';
}
