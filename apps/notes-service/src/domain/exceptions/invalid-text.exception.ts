import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';
export class InvalidText extends ProblemDetailsException {
  override type = '/error/invalid-text';
  override status = 400;
  override title = 'Invalid text';
}
