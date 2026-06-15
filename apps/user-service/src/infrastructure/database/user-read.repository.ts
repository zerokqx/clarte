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
      .select('*')
      .from('users', 'u')
      .where('u.id = :id', { id })
      .getRawOne<UserOrmEntity>();
    if (!rawUser) return null;
    return new UserReadModel(rawUser.id, rawUser.login, rawUser.avatarUrl);
  }

  async findUserByLogin(login: string): Promise<UserReadModel | null> {
    const rawUser = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from('users', 'u')
      .where('u.login = :login', { login })
      .getRawOne<UserOrmEntity>();

    if (!rawUser) return null;

    console.log(rawUser);
    return new UserReadModel(rawUser.id, rawUser.login, rawUser.avatarUrl);
  }

  async getUserCredentialsByLogin(
    login: string,
  ): Promise<CredentialsReadModel | null> {
    // Добавляем id и login в выборку.
    // "passwordHash" оставляем в кавычках из-за camelCase
    const result = await this.dataSource.query(
      'SELECT id, login, "passwordHash" FROM users WHERE login = $1 LIMIT 1',
      [login],
    );

    // 1. БЕЗОПАСНОСТЬ: Сначала проверяем, что юзер вообще нашелся
    if (!result || result.length === 0) {
      return null;
    }

    const row = result[0];

    // 2. Проверяем, что у юзера реально установлен пароль
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
