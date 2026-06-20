import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByLoginQuery } from '@/application/queries/find-by-login/find-user-by-login.query';
import { type IUserReadRepository } from '@/application/ports';
import { UserReadModel } from '@/application/models';
import { UserNotFound } from '@/application/exceptions';
import { InjectUserRepository } from '@/application/decorators';

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
