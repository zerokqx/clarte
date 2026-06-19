import { Effect } from 'effect';
import { S3StorageException, S3UploadException } from '../exceptions';
import { S3DownloadException } from '../exceptions/s3-download.exception';
import { S3DeleteException } from '../exceptions/s3-delete.exception';
import { S3NotFoundException } from '../exceptions/s3-not-found.exception';

export interface IS3 {
  /**
   * Загружает файл в хранилище и возвращает публичный URL или ключ файла
   */
  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException >;

  /**
   * Скачивает файл из хранилища по его ключу (пути)
   */
  download(
    key: string,
  ): Effect.Effect<Buffer, S3DownloadException | S3NotFoundException>;

  /**
   * Удаляет файл из хранилища
   */
  delete(
    key: string,
  ): Effect.Effect<void, S3DeleteException | S3NotFoundException>;
}
