import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '@/application/queries/find-by-id/find-user-by-id.query';
import { type IUserReadRepository } from '@/application/ports';
import { UserReadModel } from '@/application/models';
import { InjectUserRepository } from '@/application/decorators';
import { UserNotFound } from '@/application/exceptions';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @InjectUserRepository('r')
    private readonly readRepo: IUserReadRepository,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<UserReadModel> {
    const user = await this.readRepo.findUserById(query.id);
    if (!user) throw new UserNotFound('User not found');
    return user;
  }
}
