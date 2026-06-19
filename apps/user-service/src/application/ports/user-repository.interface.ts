import { User } from '@/domain/user.model';
import { CredentialsReadModel, UserReadModel } from '@/application/models';

export interface IUserWriteRepository {
  save(user: User): Promise<User>;
}

export interface IUserReadRepository {
  findUserById(id: string): Promise<UserReadModel | null>;
  findUserByLogin(login: string): Promise<UserReadModel | null>;
  getUserCredentialsByLogin(login: string): Promise<CredentialsReadModel | null>;
}
