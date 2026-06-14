import { ProblemDetailsException } from '@clarte/shared-domain';

export class TokenInvalidError extends ProblemDetailsException {
  override type = '/errors/token-invalid';
  override status = 400;
  override title = 'Token invalid';
}
