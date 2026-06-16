import { S3StorageException } from './s3.exception';

export class S3NotFoundException extends S3StorageException {
  override readonly _tag = 'S3NotFoundException' as const;
  override type = '/errors/s3-not-found-exception';
  override title = 'Not found';
  override status = 404;
}
