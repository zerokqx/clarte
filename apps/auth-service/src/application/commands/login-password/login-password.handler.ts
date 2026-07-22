import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginPasswordCommand } from '@/application/commands/login-password/login-password.command';
import { Auth } from '@clarte/shared-contracts/proto';
import { Cause, Effect, Exit, pipe } from 'effect';
import {
  InjectPasswordHasher,
  InjectUserClient,
  InjectAuthRmqClient,
} from '@/application/decorators';
import { type IJwtService, type IUserClient } from '@/application/ports';
import { ClientProxy } from '@nestjs/microservices';
import { UserEventPattern, type UserEventPayloadMap } from '@clarte/shared-event-types/user';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  UserCredentialsNotFound,
  UserServiceUnavailableException,
  PasswordVerificationFailedException,
} from '@/application/exceptions';
import { AuthUser, type IPasswordHasher } from '@/domain';
import { InjectJwtService } from '@/application/commands/login-password/jwt-service.inject';
import { E } from '@clarte/shared';
import { eventToArray } from '@clarte/shared-domain/domain';

@CommandHandler(LoginPasswordCommand)
export class LoginPasswordHandler implements ICommandHandler<LoginPasswordCommand> {
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
    @InjectJwtService() private readonly jwtService: IJwtService,
    @InjectAuthRmqClient() private readonly rmqClient: ClientProxy,
  ) {}

  async execute(command: LoginPasswordCommand): Promise<Auth.LoginPasswordResponse> {
    const exit = await pipe(
      Effect.tryPromise({
        try: () => this.userClient.getCredentialsByLogin(command.login),
        catch: (error) => {
          if (error && E.errorCode()(error) === 5) {
            return new UserCredentialsNotFound(`Credentials for ${command.login} not found`);
          }
          return new UserServiceUnavailableException(`User service is currently unavailable`);
        },
      }),
      Effect.timeout('3 seconds'),
      Effect.catchTag('TimeoutException', () =>
        Effect.fail(new UserServiceUnavailableException('Request to user-service timed out')),
      ),
      Effect.retry({
        times: 2,
        while: (error) => error instanceof UserServiceUnavailableException,
      }),
      Effect.map((cred) =>
        AuthUser.restore({
          id: cred.id,
          login: cred.login,
          passwordHash: cred.passwordHash,
        }),
      ),
      Effect.flatMap((user) =>
        pipe(
          Effect.tryPromise({
            try: () => user.login(command.password, this.passwordHasher),
            catch: (error) =>
              new PasswordVerificationFailedException(
                `Password verification failed: ${E.errorMessage('Unknown Error')(error)}`,
              ),
          }),
          Effect.map(() => user),
        ),
      ),
      Effect.flatMap((user) =>
        pipe(
          Effect.tryPromise({
            try: async () => {
              const payload = {
                sub: user.id,
                sid: '', // TODO Сделать session
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
            catch: (error) =>
              new Error(`Token generation failed: ${E.errorMessage('Unknown Error')(error)}`),
          }),

          Effect.tap(() =>
            Effect.all(
              user.domainEvents.map((ev) =>
                Effect.tryPromise({
                  try: () => {
                    console.log(ev);
                    return lastValueFrom(this.rmqClient.emit(...eventToArray(ev)));
                  },
                  catch: (error) =>
                    new Error(
                      `Failed to emit domain event: ${E.errorMessage('Unknown Error')(error)}`,
                    ),
                }),
              ),
            ),
          ),
        ),
      ),

      Effect.runPromiseExit,
    );

    const result = Exit.match(exit, {
      onFailure: (cause) => {
        throw Cause.squash(cause);
      },
      onSuccess: (value: Auth.LoginPasswordResponse) => value,
    });

    return result;
  }
}
