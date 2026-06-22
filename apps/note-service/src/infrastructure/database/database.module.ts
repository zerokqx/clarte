import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './entites';
import { NOTE_READ_REPO, NOTE_WRITE_REPO } from '@/application';
import { NoteReadRepository, NoteWriteRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  providers: [
    {
      provide: NOTE_READ_REPO,
      useClass: NoteReadRepository,
    },
    {
      provide: NOTE_WRITE_REPO,
      useClass: NoteWriteRepository,
    },
  ],
})
export class DatabaseModule {}
