export abstract class IS3Service {
  /**
   * Generates a presigned URL for uploading a file (PUT request)
   */
  abstract getUploadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn?: number,
    metadata?: Record<string, string>,
  ): Promise<string>;

  /**
   * Generates a presigned URL for downloading/viewing a file (GET request)
   */
  abstract getDownloadPresignedUrl(
    bucket: string,
    key: string,
    expiresIn?: number,
    metadata?: Record<string, string>,
  ): Promise<string>;

  /**
   * Uploads a file buffer directly to S3
   */
  abstract upload(
    bucket: string,
    key: string,
    file: Buffer,
    mimeType: string,
    metadata?: Record<string, string>,
  ): Promise<string>;

  /**
   * Downloads a file buffer directly from S3
   */
  abstract download(
    bucket: string,
    key: string,
    metadata?: Record<string, string>,
  ): Promise<Buffer>;

  /**
   * Deletes a file from S3
   */
  abstract delete(
    bucket: string,
    key: string,
  ): Promise<void>;

  /**
   * Assembles a direct, permanent public URL for a file in a public bucket
   */
  abstract getPublicUrl(bucket: string, key: string): string;
}
