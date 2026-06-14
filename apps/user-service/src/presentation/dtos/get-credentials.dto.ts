import { Contracts } from '@clarte/shared-contracts';

export class GetCredentialsDTO {
  readonly id!: string;
  readonly login!: string;
  readonly passwordHash!: string;
  constructor(
    props: Partial<Contracts.Proto.User.UserGetCredentialsByLoginResponse>,
  ) {
    Object.assign(this, props);
  }
}
