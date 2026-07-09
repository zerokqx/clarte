import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateUserQuery } from '@/application/queries/validate-user/validate-user.query';
import { Auth } from '@clarte/shared-contracts/proto';
import { InjectPasswordHasher, InjectUserClient } from '@/application/decorators';
import { type IUserClient } from '@/application/ports';
import { Cause, Effect, Exit, pipe } from 'effect';
import {
  UserCredentialsNotFound,
  UserServiceUnavailableException,
  PasswordVerificationFailedException,
} from '@/application/exceptions';
import { AuthUser, type IPasswordHasher, PasswordInvalidError } from '@/domain';
import { E } from '@clarte/shared';

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute({ login, password }: ValidateUserQuery): Promise<Auth.ValidateUserResponse> {
    const exit = await pipe(
      Effect.tryPromise({
        try: () => this.userClient.getCredentialsByLogin(login),
        catch: (error) => {
          if (error && E.errorCode()(error) === 5) {
            return new UserCredentialsNotFound(`Credentials for ${login} not found`);
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
      Effect.map((user) =>
        AuthUser.restore({
          id: user.id,
          login: user.login,
          passwordHash: user.passwordHash,
        }),
      ),
      Effect.flatMap((authUser) =>
        pipe(
          Effect.tryPromise({
            try: () => authUser.comparePassword(password, this.passwordHasher),
            catch: (error) =>
              new PasswordVerificationFailedException(
                `Password verification failed: ${E.errorMessage('Unknown error')(error)}`,
              ),
          }),
          Effect.flatMap((isValid) =>
            isValid
              ? Effect.succeed(authUser)
              : Effect.fail(new PasswordInvalidError('Invalid validation')),
          ),
        ),
      ),
      Effect.map((user) => user.getProps()),
      Effect.runPromiseExit,
    );

    return Exit.match(exit, {
      onFailure: (cause) => {
        throw Cause.squash(cause);
      },
      onSuccess: (value: Auth.ValidateUserResponse) => value,
    });
  }
}
