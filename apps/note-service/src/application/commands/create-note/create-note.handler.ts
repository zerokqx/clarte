import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from './create-note.command';
import { randomUUID } from 'crypto';
import { Note } from '@/domain';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';
import { Effect, pipe } from 'effect';
import { DatabaseException } from '@/application/exceptions';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  constructor(@InjectNoteRepo('w') private readonly noteWriteRepo: INoteRepositoryWrite) {}

  async execute(command: CreateNoteCommand): Promise<string> {
    const note = Note.create({
      id: randomUUID(),
      text: command.text,
      tags: command.tags,
      bytes: command.bytes,
      authorId: command.authorId,
    });
    const program = pipe(
      Effect.tryPromise({
        try: () => this.noteWriteRepo.save(note),
        catch: (err) => new DatabaseException('Write error', { err }),
      }),
      Effect.map(() => note.id),
    );
    return Effect.runPromise(program);
  }
}
