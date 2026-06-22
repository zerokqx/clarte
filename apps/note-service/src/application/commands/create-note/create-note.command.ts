import { Command } from '@nestjs/cqrs';

export class CreateNoteCommand extends Command<void> {
  constructor(
    public readonly text: string,
    public readonly tags: string[] = [],
    public readonly bytes: Uint8Array | null = null,
  ) {
    super();
  }
}
