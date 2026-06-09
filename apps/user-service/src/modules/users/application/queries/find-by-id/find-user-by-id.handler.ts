import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/user.model';
import { type IUserRepository } from '../../contracts/user-repository.interface';
import { Inject } from '@nestjs/common';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { USER_REPOSITORY } from '../../contracts/di-tokens';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<User | null> {
    return this.userRepository.findUserById(query.id);
  }
}
