import { User } from '@/domain/user.model';
import { UserOrmEntity } from '@/infrastructure/database/user.entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return User.restore({
      id: entity.id,
      login: entity.login,
      passwordHash: entity.passwordHash,
      avatarUrl: entity.avatarUrl,
    });
  }

  static fromDomainToOrm(entity: User): UserOrmEntity {
    return new UserOrmEntity({
      avatarUrl: entity.avatarUrl,
      id: entity.id,
      login: entity.login,
      passwordHash: entity.passwordHash,
    });
  }
}
