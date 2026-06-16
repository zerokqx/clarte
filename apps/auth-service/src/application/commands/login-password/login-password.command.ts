import { Command } from '@nestjs/cqrs';
import { Auth } from '@clarte/shared-contracts/proto';

type Response = Auth.LoginPasswordResponse;

export class LoginPasswordCommand extends Command<Response> {
  constructor(
    public readonly login: string,
    public readonly password: string
  ) {
    super();
  }
}
