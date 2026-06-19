import { Effect } from 'effect';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IS3 } from '@/application';
import { S3ConfigurationType } from './s3.config';
import {
  InjectS3Service,
  IS3Service,
  S3UploadException,
  S3DownloadException,
  S3DeleteException,
  S3NotFoundException,
} from '@clarte/shared-nest/modules';

@Injectable()
export class S3Storage implements IS3 {
  private readonly logger = new Logger(S3Storage.name);
  private readonly bucket: string;

  constructor(
    private readonly config: ConfigService,
    @InjectS3Service() private readonly s3Service: IS3Service,
  ) {
    const s3Config = this.config.getOrThrow<S3ConfigurationType>('s3-config');
    this.bucket = s3Config.bucket;
  }

  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException> {
    return Effect.gen(this, function* (_) {
      this.logger.log(
        `Uploading file ${filename} (MimeType: ${mimeType}) to S3 bucket ${this.bucket}...`,
      );

      yield* _(this.s3Service.upload(this.bucket, filename, file, mimeType));
      return filename;
    });
  }

  download(key: string): Effect.Effect<Buffer, S3DownloadException | S3NotFoundException> {
    return Effect.gen(this, function* (_) {
      this.logger.log(
        `Downloading file ${key} from S3 bucket ${this.bucket}...`,
      );
      const data = yield* _(this.s3Service.download(this.bucket, key));
      return data;
    });
  }

  delete(
    key: string,
  ): Effect.Effect<void, S3DeleteException | S3NotFoundException> {
    return Effect.gen(this, function* (_) {
      this.logger.log(`Deleting file ${key} from S3 bucket ${this.bucket}...`);

      yield* _(this.s3Service.delete(this.bucket, key));
    });
  }
}
