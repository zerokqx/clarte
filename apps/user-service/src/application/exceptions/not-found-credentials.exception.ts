import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class NotFoundCredentialsException extends ProblemDetailsException {
  override type = '/errors/not-found-credentials';
  override title = 'Not found credentials';
  override status = 404;
}
