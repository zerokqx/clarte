import { User } from '@clarte/shared-contracts/proto';

export class UserFindByIdDTO
  implements User.UserFindByIdResponse
{
  public readonly id!: string;
  public readonly login!: string;
  public readonly avatarUrl!: string;
  constructor(partial: Partial<User.UserFindByIdResponse>) {
    Object.assign(this, partial);
  }
}
