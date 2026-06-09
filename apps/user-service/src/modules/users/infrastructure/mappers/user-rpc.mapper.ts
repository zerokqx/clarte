import { Contracts } from '@clarte/shared';
import { User } from '../../domain/user.model';

export class UserRpcMapper {
  public static toRpc(user: User): Contracts.Proto.User.User {
    return {
      id: user.id,
      login: user.login,
      avatarUrl: user.avatarUrl,
    };
  }
}
