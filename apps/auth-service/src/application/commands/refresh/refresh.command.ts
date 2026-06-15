import { Contracts } from '@clarte/shared-contracts';
import { Command } from '@nestjs/cqrs';

export class RefreshCommand extends Command<Contracts.Proto.Auth.RefreshTokensResponse> {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
  ) {
    super();
  }
}
