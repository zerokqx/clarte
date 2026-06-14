import { Command } from '@nestjs/cqrs';
import { Contracts } from '@clarte/shared-contracts';

type Response = Contracts.Proto.Auth.LoginPasswordResponse;

export class LoginPasswordCommand extends Command<Response> {
  constructor(
    public readonly login: string,
    public readonly password: string
  ) {
    super();
  }
}
