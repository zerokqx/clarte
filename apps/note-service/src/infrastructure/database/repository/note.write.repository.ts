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

  async findById(id: string): Promise<Note | null> {
    const doc = await this.noteModel.findById(id).exec();
    if (!doc) return null;
    return Note.restore({
      id: doc._id,
      text: doc.text,
      tags: doc.tags,
      bytes: doc.bytes ? new Uint8Array(doc.bytes) : null,
      authorId: doc.authorId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async save(note: Note): Promise<void> {
    await this.noteModel.findByIdAndUpdate(
      note.id,
      {
        text: note.text,
        bytes: note.bytes ? Buffer.from(note.bytes) : null,
        authorId: note.authorId,
        tags: note.tags,
        updatedAt: note.updatedAt,
      },
      { upsert: true },
    );
  }
}
