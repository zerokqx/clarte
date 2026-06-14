
import { ProblemDetailsException } from '@clarte/shared-domain';

export class PasswordHashInvalidError extends ProblemDetailsException {
  override type = '/errors/password-hash-invalid';
  override status = 400;
  override title = 'Password hash invalid';
}
