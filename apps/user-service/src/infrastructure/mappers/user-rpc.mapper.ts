import { User as UserProto } from '@clarte/shared-contracts/proto';
import { User } from '@/domain/user.model';

export class UserRpcMapper {
  public static toRpc(user: User): UserProto.UserFindByLoginResponse {
    return {
      id: user.id,
      login: user.login,
      avatarUrl: user.avatarUrl,
    };
  }
}
