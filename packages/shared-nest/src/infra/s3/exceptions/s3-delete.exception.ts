import { S3StorageException } from './s3.exception';

export class S3DeleteException extends S3StorageException {
  override readonly _tag = 'S3DeleteException' as const;
  override type = '/errors/s3-delete-exception';
  override title = 'S3 Delete Failure';
}
