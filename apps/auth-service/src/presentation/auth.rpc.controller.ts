import { Contracts } from '@clarte/shared-contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import {
  ValidateUserQuery,
  GetPublicJwtKeyQuery,
  LoginPasswordCommand,
  RegisterPasswordCommand,
} from '@/application';
import { RefreshCommand } from '@/application/commands/refresh';

@Contracts.Proto.Auth.AuthServiceControllerMethods()
export class AuthController
  implements Contracts.Proto.Auth.AuthServiceController
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  validateUser(
    request: Contracts.Proto.Auth.ValidateUserRequest,
  ):
    | Promise<Contracts.Proto.Auth.ValidateUserResponse>
    | Observable<Contracts.Proto.Auth.ValidateUserResponse>
    | Contracts.Proto.Auth.ValidateUserResponse {
    return this.queryBus.execute(
      new ValidateUserQuery(request.login, request.password),
    );
  }

  loginPassword(
    request: Contracts.Proto.Auth.LoginPasswordRequest,
  ):
    | Promise<Contracts.Proto.Auth.LoginPasswordResponse>
    | Observable<Contracts.Proto.Auth.LoginPasswordResponse>
    | Contracts.Proto.Auth.LoginPasswordResponse {
    return this.commandBus.execute(
      new LoginPasswordCommand(request.login, request.password),
    );
  }

  async registerPassword(
    request: Contracts.Proto.Auth.RegisterRequest,
  ): Promise<void> {
    await this.commandBus.execute(
      new RegisterPasswordCommand(request.login, request.password),
    );
  }

  async getPublicJwtKey(
    request: Contracts.Proto.Empty,
  ): Promise<Contracts.Proto.Auth.GetPublicJwtKeyResponse> {
    const key = await this.queryBus.execute(new GetPublicJwtKeyQuery());
    return { key };
  }
  refreshTokens(
    request: Contracts.Proto.Auth.RefreshTokensRequest,
  ): Promise<Contracts.Proto.Auth.RefreshTokensResponse> {
    return this.commandBus.execute(
      new RefreshCommand(
        request.userId,
        request.refreshToken,
      ),
    );
  }
}
