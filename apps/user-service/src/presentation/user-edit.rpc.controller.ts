import { ChangeAvatarCommand } from '@/application';
import { ChangeLoginCommand } from '@/application/commands/change-login';
import { voidObject } from '@clarte/shared';
import { User } from '@clarte/shared-contracts/proto';
import { CommandBus } from '@nestjs/cqrs';
import { Metadata } from '@grpc/grpc-js';
import { getUserIdFromGrpcMetadata } from '@clarte/shared-nest/core/functions';

@User.UserEditServiceControllerMethods()
export class UserEditController implements User.UserEditServiceController {
  constructor(private readonly commandBus: CommandBus) {}

  async userChangeAvatar(
    request: User.UserEditChangeAvatarRequest,
    metadata?: Metadata,
  ): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(new ChangeAvatarCommand(userId, request.avatarUrl));
    return voidObject();
  }

  async userChangeLogin(
    request: User.UserEditChangeLoginRequest,
    metadata?: Metadata,
  ): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(new ChangeLoginCommand({ login: request.login, userId }));
    return voidObject();
  }
}
