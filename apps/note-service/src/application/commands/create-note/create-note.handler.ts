import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from './create-note.command';
import { InjectS3Service, IS3Service } from '@clarte/shared-nest/modules';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Note } from '@/domain';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryWrite } from '@/application/ports';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  private readonly bucket: string;

  constructor(
    @InjectNoteRepo.write() private readonly noteWriteRepo: INoteRepositoryWrite
  ) {}

  async execute(command: CreateNoteCommand): Promise<void> {
    const note = Note.create(randomUUID(), command.text, command.tags, command.bytes);
    await this.noteWriteRepo.save(note);
  }
}
