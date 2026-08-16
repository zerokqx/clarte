import { S3StorageException } from './s3.exception';

export class S3UploadException extends S3StorageException {
  override readonly _tag = 'S3UploadException' as const;
  override type = '/errors/s3-upload-exception';
  override title = 'S3 Upload Failure';
}
