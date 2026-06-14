import { Contracts } from '@clarte/shared-contracts';

export class UserFindByLoginDTO
  implements Contracts.Proto.User.UserFindByLoginResponse
{
  public readonly id!: string;
  public readonly login!: string;
  public readonly avatarUrl!: string;
  constructor(partial: Partial<Contracts.Proto.User.UserFindByLoginResponse>) {
    Object.assign(this, partial);
  }
}
