import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PresignedUploadQuery } from './presigned-upload.query';
import { InjectS3Service, IS3Service } from '@clarte/shared-nest/modules';
import { randomUUID } from 'crypto';

@QueryHandler(PresignedUploadQuery)
export class PresignedUploadHandler
  implements IQueryHandler<PresignedUploadQuery>
{
  constructor(@InjectS3Service() private readonly s3Service: IS3Service) {}

  execute(query: PresignedUploadQuery): Promise<string> {
    const key = `${query.userId}-${randomUUID()}.jpg`;
    return this.s3Service.getUploadPresignedUrl('avatars', key, 3600, {
      userId: query.userId,
    });
  }
}
