import { PresignedUploadQuery } from '@/application/queries/presigned-upload';
import { User } from '@clarte/shared-contracts/proto';
import { QueryBus } from '@nestjs/cqrs';
import { Metadata } from '@grpc/grpc-js';
import { getUserIdFromGrpcMetadata } from '@clarte/shared-nest/core/functions';

@User.UserStorageServiceControllerMethods()
export class UserStorageController implements User.UserStorageServiceController {
  constructor(private readonly queryBus: QueryBus) {}

  async uploadPresignedUrl(
    _request: unknown,
    metadata?: Metadata,
  ): Promise<User.UploadPresignedUrlResponse> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    const data = await this.queryBus.execute(new PresignedUploadQuery(userId));
    return { urlPresigned: data.urlPresigned, urlPublic: data.urlPublic };
  }
}
