import { Query } from '@nestjs/cqrs';
import { CredentialsReadModel } from '@/application/models';

export class GetCredentialsByLoginQuery extends Query<CredentialsReadModel | null> {
  constructor(public readonly login: string) {
    super();
  }
}
