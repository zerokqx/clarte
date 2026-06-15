import { Contracts } from '@clarte/shared-contracts';
import { User } from '@/domain/user.model';

export class UserRpcMapper {
  public static toRpc(user: User): Contracts.Proto.User.UserFindByLoginResponse {
    return {
      id: user.id,
      login: user.login,
      avatarUrl: user.avatarUrl,
    };
  }
}
