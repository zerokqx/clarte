import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { InjectJwtService } from '../login-password/jwt-service.inject';
import { type IJwtService } from '@/application/ports';
import { Cause, Effect, Exit, pipe } from 'effect';
import { Auth } from '@clarte/shared-contracts/proto';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(@InjectJwtService() private readonly jwtService: IJwtService) {}

  async execute(
    command: RefreshCommand,
  ): Promise<Auth.RefreshTokensResponse> {
    const exit = await pipe(
      Effect.tryPromise({
        try: async () => {
          // 1. Verify the refresh token to get payload
          const payload = await this.jwtService.verify(command.refreshToken);

          // 2. Generate a new access and refresh token
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
        catch: (error: any) =>
          new Error(`Token refresh failed: ${error.message}`),
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
