import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { type IUserReadRepository } from '../../ports/';
import { UserReadModel } from '../../models';
import { InjectUserRepository } from '../../decorators';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @InjectUserRepository('r')
    private readonly readRepo: IUserReadRepository,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<UserReadModel> {
    const user = await this.readRepo.findUserById(query.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
