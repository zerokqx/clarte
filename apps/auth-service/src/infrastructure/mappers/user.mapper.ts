import { IMapper } from '@clarte/shared-domain/domain';
import { AuthUser } from '@/domain';
import { UserOrmEntity } from '../database/entities';

export class UserMapper implements IMapper<UserOrmEntity, UserOrmEntity, AuthUser> {
  public toDomain(raw: UserOrmEntity): AuthUser {
    return AuthUser.restore({
      id: raw.id,
      login: raw.login,
      passwordHash: raw.passwordHash,
    });
  }

  public toPersistence(domain: AuthUser): UserOrmEntity {
    const plain = domain.toPlain();
    return new UserOrmEntity({
      id: plain.id,
      login: plain.login,
      passwordHash: plain.passwordHash,
    });
  }

  public static toDomain(entity: UserOrmEntity): AuthUser {
    return AuthUser.restore({
      id: entity.id,
      login: entity.login,
      passwordHash: entity.passwordHash,
    });
  }
}
