import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PresignedUploadQuery } from './presigned-upload.query';
import { InjectS3Service, IS3Service } from '@clarte/shared-nest/modules';
import { randomUUID } from 'crypto';
import { User } from '@clarte/shared-contracts/proto';

@QueryHandler(PresignedUploadQuery)
export class PresignedUploadHandler
  implements IQueryHandler<PresignedUploadQuery>
{
  constructor(@InjectS3Service() private readonly s3Service: IS3Service) {}

  async execute(
    query: PresignedUploadQuery,
  ): Promise<User.UploadPresignedUrlResponse> {
    const key = `${query.userId}-${randomUUID()}.jpg`;
    const urlPresigned = await this.s3Service.getUploadPresignedUrl(
      'avatars',
      key,
      3600,
      {
        userId: query.userId,
      },
    );
    const urlPublic = this.s3Service.getPublicUrl('avatars', key);
    return { urlPresigned, urlPublic };
  }
}
