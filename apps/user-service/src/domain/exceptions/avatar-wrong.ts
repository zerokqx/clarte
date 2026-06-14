import { ProblemDetailsException } from '@clarte/shared-domain';

export class AvatarWrongError extends ProblemDetailsException {
  override type = '/errors/avatar-format-wrong';
  override title = 'Avatar wrong';
  override status = 400;
}
