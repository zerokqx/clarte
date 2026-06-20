import { AppConfigModule, S3SharedModule } from '@clarte/shared-nest/modules';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNoteHandler } from './application/commands/create-note';
import { NotesController } from './presentation';

const handlers: Provider[] = [CreateNoteHandler];

@Module({
  imports: [AppConfigModule, CqrsModule, S3SharedModule],
  controllers: [NotesController],
  providers: [...handlers],
})
export class AppModule {}
