import { Injectable } from '@nestjs/common';
import { InjectS3, type S3 } from 'nestjs-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Effect } from 'effect';
import { IS3Service } from './ports/s3-service.interface';
import { S3ConfigurationType } from './s3.config';
import {
  S3UploadException,
  S3DownloadException,
  S3DeleteException,
  S3NotFoundException,
  S3StorageException,
} from './exceptions';

@Injectable()
export class S3Service implements IS3Service {
  private readonly defaultEndpoint: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly config: ConfigService,
  ) {
    const s3Config = this.config.get<S3ConfigurationType>('s3-config');
    this.defaultEndpoint = s3Config?.endpoint || 'http://localhost:6003';
  }

  getUploadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn = 3600,
  ): Effect.Effect<string, S3StorageException> {
    return Effect.tryPromise({
      try: () => {
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        return getSignedUrl(this.s3, command, { expiresIn });
      },
      catch: (err) =>
        new S3UploadException(
          err instanceof Error ? err.message : 'Could not generate upload presigned URL',
        ),
    });
  }

  getDownloadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn = 3600,
  ): Effect.Effect<string, S3StorageException> {
    return Effect.tryPromise({
      try: () => {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        return getSignedUrl(this.s3, command, { expiresIn });
      },
      catch: (err) =>
        new S3DownloadException(
          err instanceof Error ? err.message : 'Could not generate download presigned URL',
        ),
    });
  }

  upload(
    bucket: string,
    key: string,
    file: Buffer,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException> {
    return Effect.tryPromise({
      try: async () => {
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
        });
        await this.s3.send(command);
        return key;
      },
      catch: (err) =>
        new S3UploadException(
          err instanceof Error ? err.message : 'The file could not be uploaded. Try again later',
        ),
    });
  }

  download(
    bucket: string,
    key: string,
  ): Effect.Effect<Buffer, S3DownloadException | S3NotFoundException> {
    return Effect.tryPromise({
      try: async () => {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        const response = await this.s3.send(command);
        if (!response.Body) {
          throw new Error('Response body is empty');
        }
        const byteArray = await response.Body.transformToByteArray();
        return Buffer.from(byteArray);
      },
      catch: (err) => {
        if (err instanceof Error && (err.name === 'NoSuchKey' || err.message.includes('NoSuchKey'))) {
          return new S3NotFoundException('File not found');
        }
        return new S3DownloadException(
          err instanceof Error ? err.message : "Couldn't download the file",
        );
      },
    });
  }

  delete(
    bucket: string,
    key: string,
  ): Effect.Effect<void, S3DeleteException | S3NotFoundException> {
    return Effect.tryPromise({
      try: async () => {
        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        await this.s3.send(command);
      },
      catch: (err) => {
        if (err instanceof Error && (err.name === 'NoSuchKey' || err.message.includes('NoSuchKey'))) {
          return new S3NotFoundException('File not found');
        }
        return new S3DeleteException(
          err instanceof Error ? err.message : 'For some reason, the file could not be deleted.',
        );
      },
    });
  }

  getPublicUrl(bucket: string, key: string): string {
    const endpoint = this.defaultEndpoint.replace(/\/$/, '');
    const cleanKey = key.replace(/^\//, '');
    return `${endpoint}/${bucket}/${cleanKey}`;
  }
}
