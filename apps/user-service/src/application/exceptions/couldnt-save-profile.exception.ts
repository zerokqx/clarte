
import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export class CouldntSaveProfileError extends ProblemDetailsException {
  override type = "/errors/couldnt-save-profile";
  override title = "Couldn't save profile";
  override status = 500;
}
