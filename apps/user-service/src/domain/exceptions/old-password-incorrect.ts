
import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class OldPasswordIncorrectError extends ProblemDetailsException {
  override type = '/errors/old-password-incorrect';
  override title = 'Old password incorrect';
  override status = 400;
}
