import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/user.model';
import { type IUserRepository } from '../../contracts/user-repository.interface';
import { Inject } from '@nestjs/common';
import { FindUserByLoginQuery } from './find-user-by-login.query';
import { UserLogin } from '../../../domain/value-objects/login.vo';
import { USER_REPOSITORY } from '../../contracts/di-tokens';

@QueryHandler(FindUserByLoginQuery)
export class FindUserByLoginHandler
  implements IQueryHandler<FindUserByLoginQuery>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: FindUserByLoginQuery): Promise<User | null> {
    const login = UserLogin.create(query.login);
    return this.userRepository.findUserByLogin(login.value);
  }
}
