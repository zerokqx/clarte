import { Auth } from '@clarte/shared-contracts/proto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import {
  ValidateUserQuery,
  GetPublicJwtKeyQuery,
  LoginPasswordCommand,
  RegisterPasswordCommand,
} from '@/application';
import { RefreshCommand } from '@/application/commands/refresh';

@Auth.AuthServiceControllerMethods()
export class AuthController
  implements Auth.AuthServiceController
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  validateUser(
    request: Auth.ValidateUserRequest,
  ):
    | Promise<Auth.ValidateUserResponse>
    | Observable<Auth.ValidateUserResponse>
    | Auth.ValidateUserResponse {
    return this.queryBus.execute(
      new ValidateUserQuery(request.login, request.password),
    );
  }

  loginPassword(
    request: Auth.LoginPasswordRequest,
  ):
    | Promise<Auth.LoginPasswordResponse>
    | Observable<Auth.LoginPasswordResponse>
    | Auth.LoginPasswordResponse {
    return this.commandBus.execute(
      new LoginPasswordCommand(request.login, request.password),
    );
  }

  async registerPassword(
    request: Auth.RegisterRequest,
  ): Promise<void> {
    await this.commandBus.execute(
      new RegisterPasswordCommand(request.login, request.password),
    );
    return {} as any
  }

  async getPublicJwtKey(): Promise<Auth.GetPublicJwtKeyResponse> {
    const key = await this.queryBus.execute(new GetPublicJwtKeyQuery());
    return { key };
  }
  refreshTokens(
    request: Auth.RefreshTokensRequest,
  ): Promise<Auth.RefreshTokensResponse> {
    return this.commandBus.execute(
      new RefreshCommand(
        request.userId,
        request.refreshToken,
      ),
    );
  }
}
