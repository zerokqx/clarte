import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from './create-note.command';
import { randomUUID } from 'crypto';
import { Note } from '@/domain';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  constructor(
    @InjectNoteRepo('w') private readonly noteWriteRepo: INoteRepositoryWrite,
  ) {}

  async execute(command: CreateNoteCommand): Promise<string> {
    const note = Note.create(
      randomUUID(),
      command.text,
      command.tags,
      command.bytes,
    );
    await this.noteWriteRepo.save(note);
    return note.id;
  }
}
