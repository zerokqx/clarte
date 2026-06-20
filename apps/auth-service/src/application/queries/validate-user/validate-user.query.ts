import { Query } from '@nestjs/cqrs';
import { Auth } from '@clarte/shared-contracts/proto';

export class ValidateUserQuery extends Query<Auth.ValidateUserResponse> {
  constructor(
    public readonly login: string,
    public readonly password: string,
  ) {
    super();
  }
}
