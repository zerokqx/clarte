import { ProblemDetailsException } from '@clarte/shared-domain';

export class UserAlreadyExistsException extends ProblemDetailsException {
  override type = '/errors/user-already-exists';
  override status = 409;
  override title = 'User already exists';
}
