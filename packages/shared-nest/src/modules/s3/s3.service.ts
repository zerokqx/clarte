import { Injectable } from '@nestjs/common';
import { InjectS3, type S3 } from 'nestjs-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IS3Service } from './ports/s3-service.interface';

@Injectable()
export class S3Service implements IS3Service {
  constructor(@InjectS3() private readonly s3: S3) {}

  getUploadPresignedUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  getDownloadPresignedUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async upload(bucket: string, key: string, file: Buffer, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimeType,
    });
    await this.s3.send(command);
    return key;
  }

  async download(bucket: string, key: string): Promise<Buffer> {
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
  }

  async delete(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.s3.send(command);
  }
}
