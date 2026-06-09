import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetCredentialsByIdQuery,
  IUserCredentials,
} from './get-credentials-by-id.query';
import { type IUserRepository } from '../../contracts/user-repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../contracts/di-tokens';

@QueryHandler(GetCredentialsByIdQuery)
export class GetCredentialsByIdHandelr
  implements IQueryHandler<GetCredentialsByIdQuery>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    query: GetCredentialsByIdQuery,
  ): Promise<IUserCredentials | null> {
    const user = await this.userRepository.findUserById(query.id);
    if (!user) return null;
    return { passwordHash: user.passwordHash };
  }
}
