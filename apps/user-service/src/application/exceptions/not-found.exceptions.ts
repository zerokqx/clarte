import { ProblemDetailsException } from '@clarte/shared-domain';

export class UserNotFound extends ProblemDetailsException {
  override type = '/errors/not-found';
  override title = 'User not found';
  override status = 404;
}
