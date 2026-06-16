import { Auth } from '@clarte/shared-contracts/proto';
import { Command } from '@nestjs/cqrs';

export class RefreshCommand extends Command<Auth.RefreshTokensResponse> {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
  ) {
    super();
  }
}
