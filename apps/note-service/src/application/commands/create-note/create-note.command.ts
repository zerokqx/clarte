import { Command } from '@nestjs/cqrs';

export class CreateNoteCommand extends Command<void> {
  constructor(readonly text: string) {
    super();
  }
}
