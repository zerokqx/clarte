import { User } from '@clarte/shared-contracts/proto';

export class UserFindByLoginDTO
  implements User.UserFindByLoginResponse
{
  public readonly id!: string;
  public readonly login!: string;
  public readonly avatarUrl!: string;
  constructor(partial: Partial<User.UserFindByLoginResponse>) {
    Object.assign(this, partial);
  }
}
