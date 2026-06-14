import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginPasswordCommand } from './login-password.command';
import { Contracts } from '@clarte/shared-contracts';
import { Cause, Effect, Exit, pipe } from 'effect';
import { InjectPasswordHasher, InjectUserClient } from '../../decorators';
import { type IJwtService, type IUserClient } from '../../ports';
import {
  UserCredentialsNotFound,
  UserServiceUnavailableException,
  PasswordVerificationFailedException,
} from '../../exceptions';
import {
  AuthUser,
  type IPasswordHasher,
  PasswordInvalidError,
} from '../../../domain';
import { InjectJwtService } from './jwt-service.inject';

@CommandHandler(LoginPasswordCommand)
export class LoginPasswordHandler
  implements ICommandHandler<LoginPasswordCommand>
{
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
    @InjectJwtService() private readonly jwtService: IJwtService,
  ) {}

  async execute(
    command: LoginPasswordCommand,
  ): Promise<Contracts.Proto.Auth.LoginPasswordResponse> {
    const exit = await pipe(
      Effect.tryPromise({
        try: () => this.userClient.getCredentialsByLogin(command.login),
        catch: (error: any) => {
          if (error && error.code === 5) {
            return new UserCredentialsNotFound(
              `Credentials for ${command.login} not found`,
            );
          }
          return new UserServiceUnavailableException(
            `User service is currently unavailable`,
          );
        },
      }),
      Effect.timeout('3 seconds'),
      Effect.catchTag('TimeoutException', () =>
        Effect.fail(
          new UserServiceUnavailableException(
            'Request to user-service timed out',
          ),
        ),
      ),
      Effect.retry({
        times: 2,
        while: (error) => error instanceof UserServiceUnavailableException,
      }),
      Effect.map((cred) =>
        AuthUser.restore(cred.id, cred.login, cred.passwordHash),
      ),
      Effect.flatMap((user) =>
        pipe(
          Effect.tryPromise({
            try: () =>
              user.comparePassword(command.password, this.passwordHasher),
            catch: (error: any) =>
              new PasswordVerificationFailedException(
                `Password verification failed: ${error.message}`,
              ),
          }),
          Effect.filterOrFail(
            (isValid) => isValid,
            () => new PasswordInvalidError('Invalid password'),
          ),
          Effect.map(() => user),
        ),
      ),
      Effect.flatMap((user) =>
        Effect.tryPromise({
          try: async () => {
            const payload = {
              sub: user.id,
              sid: '',
            };
            const [accessToken, refreshToken] = await Promise.all([
              this.jwtService.generateAccess(payload),
              this.jwtService.generateRefresh(payload),
            ]);
            return {
              success: true,
              accessToken: accessToken.value,
              refreshToken: refreshToken.value,
              userId: user.id,
            };
          },
          catch: (error: any) =>
            new Error(`Token generation failed: ${error.message}`),
        }),
      ),
      Effect.runPromiseExit,
    );

    return Exit.match(exit, {
      onFailure: (cause) => {
        throw Cause.squash(cause);
      },
      onSuccess: (value: Contracts.Proto.Auth.LoginPasswordResponse) => value,
    });
  }
}
