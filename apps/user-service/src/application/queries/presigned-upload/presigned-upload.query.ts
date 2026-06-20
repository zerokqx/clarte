import { User } from '@clarte/shared-contracts/proto';
import { Query } from '@nestjs/cqrs';

export class PresignedUploadQuery extends Query<User.UploadPresignedUrlResponse> {
  constructor(readonly userId: string) {
    super();
  }
}
