import { User } from '../../domain/user.model';

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByLogin(login: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
