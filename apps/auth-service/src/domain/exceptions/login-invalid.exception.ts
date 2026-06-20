import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class LoginInvalidError extends ProblemDetailsException {
  override type = '/errors/login-invalid';
  override status = 400;
  override title = 'Login invalid';
}
