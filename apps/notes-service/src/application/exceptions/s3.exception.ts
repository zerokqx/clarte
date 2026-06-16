import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';

export abstract class S3StorageException extends ProblemDetailsException {
  abstract readonly _tag: string;
  override type = '/errors/s3-storage-exceptions';
  override title = 'S3 Storage Failure';
  override status = 500;
}
