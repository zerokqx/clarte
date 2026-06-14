import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCredentialsByLoginQuery } from './get-credentials-by-id.query';
import { type IUserReadRepository } from '../../ports/';
import { CredentialsReadModel } from '../../models';
import { NotFoundCredentialsException } from '../../exceptions';
import { InjectUserRepository } from '../../decorators';

@QueryHandler(GetCredentialsByLoginQuery)
export class GetCredentialsByIdHandelr
  implements IQueryHandler<GetCredentialsByLoginQuery>
{
  constructor(
    @InjectUserRepository('r')
    private readonly userRepository: IUserReadRepository,
  ) {}
  async execute(query: GetCredentialsByLoginQuery): Promise<CredentialsReadModel> {
    const credentials = await this.userRepository.getUserCredentialsByLogin(query.login);
    if (!credentials)
      throw new NotFoundCredentialsException(
        `Credentials for user by id ${query.login} not found`,
      );
    return credentials;
  }
}
