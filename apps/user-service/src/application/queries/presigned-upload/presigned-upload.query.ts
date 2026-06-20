import { Query } from '@nestjs/cqrs';

export class PresignedUploadQuery extends Query<string> {
  constructor(readonly userId: string) {super()}
}
