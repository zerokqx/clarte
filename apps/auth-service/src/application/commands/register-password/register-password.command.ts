import { Command } from '@nestjs/cqrs';

export class RegisterPasswordCommand extends Command<void> {
  constructor(
    public readonly login: string,
    public readonly password: string
  ) {
    super();
  }
}
