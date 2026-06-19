import { Effect } from 'effect';
import {
  S3StorageException,
  S3UploadException,
  S3DownloadException,
  S3DeleteException,
  S3NotFoundException,
} from '@clarte/shared-domain/exceptions';

export abstract class IS3Service {
  /**
   * Generates a presigned URL for uploading a file (PUT request)
   */
  abstract getUploadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn?: number,
  ): Effect.Effect<string, S3StorageException>;

  /**
   * Generates a presigned URL for downloading/viewing a file (GET request)
   */
  abstract getDownloadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn?: number,
  ): Effect.Effect<string, S3StorageException>;

  /**
   * Uploads a file buffer directly to S3
   */
  abstract upload(
    bucket: string,
    key: string,
    file: Buffer,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException>;

  /**
   * Downloads a file buffer directly from S3
   */
  abstract download(
    bucket: string,
    key: string,
  ): Effect.Effect<Buffer, S3DownloadException | S3NotFoundException>;

  /**
   * Deletes a file from S3
   */
  abstract delete(
    bucket: string,
    key: string,
  ): Effect.Effect<void, S3DeleteException | S3NotFoundException>;

  /**
   * Assembles a direct, permanent public URL for a file in a public bucket
   */
  abstract getPublicUrl(bucket: string, key: string): string;
}
