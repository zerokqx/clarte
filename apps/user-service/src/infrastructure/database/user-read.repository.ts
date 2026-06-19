import { SnakeCasedProperties } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@/infrastructure/database/user.entity';
import { IUserReadRepository } from '@/application';
import { InjectDataSource } from '@nestjs/typeorm';
import { CredentialsReadModel, UserReadModel } from '@/application';

@Injectable()
export class UserReadRepository implements IUserReadRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findUserById(id: string): Promise<UserReadModel | null> {
    const rawUser = await this.dataSource
      .createQueryBuilder()
      .from('users', 'u')
      .select(['u.id AS id', 'u.login as login', 'u.avatar_url'])
      .where('u.id = :id', { id })
      .getRawOne<SnakeCasedProperties<UserOrmEntity>>();
    if (!rawUser) return null;
    return new UserReadModel(rawUser.id, rawUser.login, rawUser.avatar_url);
  }

  async findUserByLogin(login: string): Promise<UserReadModel | null> {
    const rawUser = await this.dataSource
      .createQueryBuilder()
      .from('users', 'u')
      .select(['u.id AS id', 'u.login as login', 'u.avatar_url'])
      .where('u.login = :login', { login })
      .getRawOne<SnakeCasedProperties<UserOrmEntity>>();

    if (!rawUser) return null;

    return new UserReadModel(rawUser.id, rawUser.login, rawUser.avatar_url);
  }

  async getUserCredentialsByLogin(
    login: string,
  ): Promise<CredentialsReadModel | null> {
    const result = await this.dataSource.query(
      'SELECT id, login, password_hash AS "passwordHash" FROM users WHERE login = $1 LIMIT 1',
      [login],
    );

    if (!result || result.length === 0) {
      return null;
    }

    const row = result[0];

    if (!row.passwordHash) {
      return null;
    }

    return new CredentialsReadModel(
      row.id,
      row.login,
      row.passwordHash as string,
    );
  }
}
