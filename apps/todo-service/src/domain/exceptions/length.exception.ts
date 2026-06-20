import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class LengthInvalidException extends ProblemDetailsException {
  override type = '/errors/length-exception';
  override title = 'Length Error';
  override status = 400;
}

export class LengthDescriptionInvalidException extends LengthInvalidException {
  override title = 'Description length Error';
}

export class LengthTitleInvalidException extends LengthInvalidException {
  override title = 'Title length Error';
}
