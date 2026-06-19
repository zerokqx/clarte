import { Effect } from 'effect';
import {
  S3StorageException,
  S3UploadException,
  S3DownloadException,
  S3DeleteException,
  S3NotFoundException,
} from '@clarte/shared-nest/modules';

export interface IS3 {
  /**
   * Загружает файл в хранилище и возвращает публичный URL или ключ файла
   */
  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Effect.Effect<string, S3UploadException>;

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
