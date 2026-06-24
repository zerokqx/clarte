import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveNoteBytesCommand } from './save-note-bytes.command';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@CommandHandler(SaveNoteBytesCommand)
export class SaveNoteBytesHandler
  implements ICommandHandler<SaveNoteBytesCommand>
{
  constructor(
    @InjectNoteRepo('w') private readonly noteWriteRepo: INoteRepositoryWrite,
  ) {}

  async execute(command: SaveNoteBytesCommand): Promise<void> {
    const note = await this.noteWriteRepo.findById(command.id);

    if (!note) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Note not found',
      });
    }

    note.changeBytes(command.bytes);

    await this.noteWriteRepo.save(note);
  }
}
