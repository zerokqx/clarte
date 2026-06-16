import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from './create-note.command';
import { InjectS3 } from '@/application/decorators';
import { type IS3 } from '@/application/ports';
import { Effect } from 'effect';
import { randomUUID } from 'crypto';
import { TextVo } from '@/domain/value-objects';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  constructor(@InjectS3() private readonly s3: IS3) {}

  async execute(command: CreateNoteCommand): Promise<void> {
    const text = TextVo.create(command.text)
    this.s3
      .upload(
        Buffer.from(text.value, 'utf-8'),
        `${randomUUID()}.md`,
        'text/markdown',
      )
      .pipe(Effect.runPromiseExit);
    return;
  }
}
