import { User } from '@clarte/shared-contracts/proto';

export class GetCredentialsDTO {
  readonly id!: string;
  readonly login!: string;
  readonly passwordHash!: string;
  constructor(
    props: Partial<User.UserGetCredentialsByLoginResponse>,
  ) {
    Object.assign(this, props);
  }
}
