import { S3StorageException } from './s3.exception';

export class S3UploadException extends S3StorageException {
  readonly _tag = 'S3UploadException' as const;
  override type = '/errors/s3-uppload-exception';
  override title = 'S3 Upload Failure';
}
