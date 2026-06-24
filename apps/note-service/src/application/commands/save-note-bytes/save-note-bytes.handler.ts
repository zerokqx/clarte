import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveNoteBytesCommand } from './save-note-bytes.command';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';
import { NoteNotFoundException } from '@/application/exceptions';
import { Effect, pipe } from 'effect';

@CommandHandler(SaveNoteBytesCommand)
export class SaveNoteBytesHandler
  implements ICommandHandler<SaveNoteBytesCommand>
{
  constructor(
    @InjectNoteRepo('w') private readonly noteWriteRepo: INoteRepositoryWrite,
  ) {}

  async execute(command: SaveNoteBytesCommand): Promise<void> {
    const program = pipe(
      Effect.tryPromise({
        try: () => this.noteWriteRepo.findById(command.id),
        catch: (error) => error,
      }),
      Effect.flatMap((note) =>
        note
          ? Effect.succeed(note)
          : Effect.fail(new NoteNotFoundException(`Note id=${command.id} not found`)),
      ),
      Effect.tap((note) => {
        note.changeBytes(command.bytes);
      }),
      Effect.flatMap((note) =>
        Effect.tryPromise({
          try: () => this.noteWriteRepo.save(note),
          catch: (error) => error,
        }),
      ),
    );

    await Effect.runPromise(program);
  }
}

