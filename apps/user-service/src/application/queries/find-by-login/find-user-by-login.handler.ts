import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByLoginQuery } from './find-user-by-login.query';
import { type IUserReadRepository } from '../../ports/';
import { UserReadModel } from '../../models';
import { UserNotFound } from '../../exceptions';
import { InjectUserRepository } from '../../decorators';

@QueryHandler(FindUserByLoginQuery)
export class FindUserByLoginHandler
  implements IQueryHandler<FindUserByLoginQuery>
{
  constructor(
    @InjectUserRepository('r')
    private readonly readRepo: IUserReadRepository,
  ) {}

  async execute(query: FindUserByLoginQuery): Promise<UserReadModel> {
    const user = await this.readRepo.findUserByLogin(query.login);
    if (!user)
      throw new UserNotFound(`User with ${query.login} not found`, {
        login: query.login,
      });
    return user;
  }
}
