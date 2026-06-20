import { Command } from '@nestjs/cqrs';

export class ChangeAvatarCommand extends Command<void> {
  constructor(
    readonly id: string,
    readonly avatarUrl: string,
  ) {
    super();
  }
}
