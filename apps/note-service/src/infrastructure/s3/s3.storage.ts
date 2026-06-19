import { Effect } from 'effect';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { IS3 } from '@/application';
import { S3ConfigurationType } from './s3.config';
import { InjectS3, type S3 } from 'nestjs-s3';
import { S3UploadException } from '@/application/exceptions';
import { S3DownloadException } from '@/application/exceptions/s3-download.exception';
import { S3DeleteException } from '@/application/exceptions/s3-delete.exception';
import { S3NotFoundException } from '@/application/exceptions/s3-not-found.exception';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // <-- Наш импорт

@Injectable()
export class S3Storage implements IS3 {
  private readonly logger = new Logger(S3Storage.name);
  private readonly bucket: string;

  constructor(
    private readonly config: ConfigService,
    @InjectS3() private readonly s3: S3,
  ) {
    const s3Config = this.config.getOrThrow<S3ConfigurationType>('s3-config');
    this.bucket = s3Config.bucket;
  }

  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: 'test-key',
    });
    const d = getSignedUrl(this.s3, command, { expiresIn: 6000 }).then((v) =>
      console.log(v),
    );
    return Effect.gen(this, function* (_) {
      this.logger.log(
        `Uploading file ${filename} (MimeType: ${mimeType}) to S3 bucket ${this.bucket}...`,
      );


      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file,
        ContentType: mimeType,
      });
      yield* _(
        Effect.tryPromise({
          try: () => this.s3.send(command),
          catch: () =>
            new S3UploadException(
              'The file could not be uploaded. Try again later',
            ),
        }),
      );
      return filename;
    });
  }

  download(key: string): Effect.Effect<Buffer, S3DownloadException> {
    return Effect.gen(this, function* (_) {
      this.logger.log(
        `Downloading file ${key} from S3 bucket ${this.bucket}...`,
      );
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = yield* _(
        Effect.tryPromise({
          try: () => this.s3.send(command),
          catch: () => new S3DownloadException("Couldn't download the file"),
        }),
      );
      const byteArray = yield* _(
        Effect.tryPromise({
          try: () => {
            if (!response.Body) return Promise.reject('Body is missing');
            return response.Body.transformToByteArray();
          },
          catch: () =>
            new S3DownloadException("Couldn't convert data to bytes"),
        }),
      );
      return Buffer.from(byteArray);
    });
  }

  delete(
    key: string,
  ): Effect.Effect<void, S3DeleteException | S3NotFoundException> {
    return Effect.gen(this, function* (_) {
      this.logger.log(`Deleting file ${key} from S3 bucket ${this.bucket}...`);

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      yield* _(
        Effect.tryPromise({
          try: () => this.s3.send(command),
          catch: () =>
            new S3DeleteException(
              'For some reason, the file could not be deleted.',
            ),
        }),
      );
    });
  }
}
