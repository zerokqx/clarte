import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class PasswordVerificationFailedException extends ProblemDetailsException {
  override type = '/errors/password-verification-failed';
  override status = 500;
  override title = 'Password Verification Failed';
}
