import { ProblemDetailsException } from '@clarte/shared-domain';

export class UserCredentialsNotFound extends ProblemDetailsException {
  override type = '/errors/user-credentials-not-found';
  override status = 404;
  override title = 'User credentials not found';
}
