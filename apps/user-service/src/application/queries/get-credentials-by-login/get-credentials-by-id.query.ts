import { Query } from '@nestjs/cqrs';
import { CredentialsReadModel } from '../../models';

export class GetCredentialsByLoginQuery extends Query<CredentialsReadModel | null> {
  constructor(public readonly login: string) {
    super();
  }
}
