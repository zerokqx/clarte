import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from './create-note.command';
import { InjectS3Service, IS3Service } from '@clarte/shared-nest/modules';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { TextVo } from '@/domain/value-objects';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  private readonly bucket: string;

  constructor(
    @InjectS3Service() private readonly s3: IS3Service,
    private readonly config: ConfigService,
  ) {
    const s3Config = this.config.getOrThrow<{ bucket: string }>('s3-config');
    this.bucket = s3Config.bucket;
  }

  async execute(command: CreateNoteCommand): Promise<void> {
    const text = TextVo.create(command.text);
    await this.s3.upload(
      this.bucket,
      `${randomUUID()}.md`,
      Buffer.from(text.value, 'utf-8'),
      'text/markdown',
    );
  }
}
