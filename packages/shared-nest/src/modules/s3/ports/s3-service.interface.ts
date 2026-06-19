export abstract class IS3Service {
  /**
   * Generates a presigned URL for uploading a file (PUT request)
   */
  abstract getUploadPresignedUrl(bucket: string, key: string, expiresIn?: number): Promise<string>;

  /**
   * Generates a presigned URL for downloading/viewing a file (GET request)
   */
  abstract getDownloadPresignedUrl(bucket: string, key: string, expiresIn?: number): Promise<string>;

  /**
   * Uploads a file buffer directly to S3
   */
  abstract upload(bucket: string, key: string, file: Buffer, mimeType: string): Promise<string>;

  /**
   * Downloads a file buffer directly from S3
   */
  abstract download(bucket: string, key: string): Promise<Buffer>;

  /**
   * Deletes a file from S3
   */
  abstract delete(bucket: string, key: string): Promise<void>;
}
