import { Query } from '@nestjs/cqrs';
import { Contracts } from '@clarte/shared-contracts';

export class ValidateUserQuery extends Query<Contracts.Proto.Auth.ValidateUserResponse> {
  constructor(
    public readonly login: string,
    public readonly password: string,
  ) {
    super();
  }
}
