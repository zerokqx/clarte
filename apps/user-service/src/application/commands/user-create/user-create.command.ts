import { Command } from '@nestjs/cqrs';

export class UserCreateCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly login: string,
    public readonly passwordHash: string,
  ) {
    super();
  }
}
