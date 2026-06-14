import { Contracts } from '@clarte/shared-contracts';

export class UserFindByIdDTO
  implements Contracts.Proto.User.UserFindByIdResponse
{
  public readonly id!: string;
  public readonly login!: string;
  public readonly avatarUrl!: string;
  constructor(partial: Partial<Contracts.Proto.User.UserFindByIdResponse>) {
    Object.assign(this, partial);
  }
}
