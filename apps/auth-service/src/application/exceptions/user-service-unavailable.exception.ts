import { ProblemDetailsException } from '@clarte/shared-domain';

export class UserServiceUnavailableException extends ProblemDetailsException {
  override type = '/errors/user-service-unavailable';
  override status = 503;
  override title = 'User Service Unavailable';
}
