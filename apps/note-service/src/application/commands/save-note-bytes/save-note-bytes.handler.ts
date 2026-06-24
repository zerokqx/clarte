import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveNoteBytesCommand } from './save-note-bytes.command';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';
import { NoteNotFoundException } from '@/application/exceptions';

@CommandHandler(SaveNoteBytesCommand)
export class SaveNoteBytesHandler implements ICommandHandler<SaveNoteBytesCommand> {
  constructor(
    @InjectNoteRepo('w') private readonly noteWriteRepo: INoteRepositoryWrite,
  ) {}

  async execute(command: SaveNoteBytesCommand): Promise<void> {
    const note = await this.noteWriteRepo.findById(command.id);

    if (!note)
      throw new NoteNotFoundException(`Note id=${command.id} not found`);

    note.changeBytes(command.bytes);

    await this.noteWriteRepo.save(note);
  }
}
