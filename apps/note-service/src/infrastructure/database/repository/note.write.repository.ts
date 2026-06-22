import { INoteRepositoryWrite } from '@/application';
import { NoteDocument, Note as NoteMongo } from '../entites';
import { Note } from '@/domain';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class NoteWriteRepository implements INoteRepositoryWrite {
  constructor(
    @InjectModel(NoteMongo.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async save(note: Note): Promise<void> {
    const newNote = new this.noteModel({
      _id: note.id,
      text: note.text,
      bytes: note.bytes ? Buffer.from(note.bytes) : null,
      authorId: note.authorId,
      tags: note.tags,
    });
    await newNote.save();
  }
}
