import { Query } from '@nestjs/cqrs';

export interface IUserCredentials {
  passwordHash: string;
}

export class GetCredentialsByIdQuery extends Query<IUserCredentials | null> {
  constructor(public readonly id: string) {
    super();
  }
}
