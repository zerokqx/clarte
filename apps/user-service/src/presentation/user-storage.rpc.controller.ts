import { PresignedUploadQuery } from '@/application/queries/presigned-upload';
import { User } from '@clarte/shared-contracts/proto';
import { QueryBus } from '@nestjs/cqrs';

@User.UserStorageServiceControllerMethods()
export class UserStorageController
  implements User.UserStorageServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async uploadPresignedUrl(
    request: User.UploadPresignedUrlRequest,
  ): Promise<User.UploadPresignedUrlResponse> {
    const data = await this.queryBus.execute(
      new PresignedUploadQuery(request.userId),
    );
    return { urlPresigned: data.urlPresigned, urlPublic: data.urlPublic };
  }
}
