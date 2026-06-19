import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';
export class IdInvalidException extends ProblemDetailsException {
  override type = '/errors/id-invalid-exception';
  override title = 'Id Invalid Excepiton';
  override status = 400;
}
