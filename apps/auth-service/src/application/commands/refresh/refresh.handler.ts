import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { InjectJwtService } from '../login-password/jwt-service.inject';
import { type IJwtService } from '@/application/ports';
import { Cause, Effect, Exit, pipe } from 'effect';
import { Auth } from '@clarte/shared-contracts/proto';
import { E } from '@clarte/shared';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(@InjectJwtService() private readonly jwtService: IJwtService) {}

  async execute(command: RefreshCommand): Promise<Auth.RefreshTokensResponse> {
    const exit = await pipe(
      Effect.tryPromise({
        try: async () => {
          const payload = await this.jwtService.verify(command.refreshToken);

          const tokenPayload = {
            sub: payload.sub,
            sid: payload.sid,
          };

          const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateAccess(tokenPayload),
            this.jwtService.generateRefresh(tokenPayload),
          ]);

          return {
            accessToken: accessToken.value,
            refreshToken: refreshToken.value,
          };
        },
        catch: (error) =>
          new Error(`Token refresh failed: ${E.errorMessage(error)('Unknown Error')}`),
      }),
      Effect.runPromiseExit,
    );

    return Exit.match(exit, {
      onFailure: (cause) => {
        throw Cause.squash(cause);
      },
      onSuccess: (value: Auth.RefreshTokensResponse) => value,
    });
  }
}
