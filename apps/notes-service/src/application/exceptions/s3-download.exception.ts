import { S3StorageException } from './s3.exception';

export class S3DownloadException extends S3StorageException {
  override readonly _tag = 'S3DownloadException' as const;
  override type = '/errors/s3-download-exception';
  override title = 'S3 Download Failure';
}

