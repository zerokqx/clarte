import { INoteRepositoryRead } from '@/application';
import { NoteReadModel } from '@/application/models';

import { NoteDocument, Note as NoteMongo } from '../entites';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class NoteReadRepository implements INoteRepositoryRead {
  constructor(
    @InjectModel(NoteMongo.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}
  async findById(id: string): Promise<NoteReadModel | null> {
    const note = await this.noteModel
      .findById(id)
      .select('-bytes')
      .lean()
      .exec();

    if (!note) return null;
    return new NoteReadModel({
      id: note._id,
      text: note.text,
      tags: note.tags || [],
      authorId: note.authorId,
      updatedAt: note.updatedAt,
      createdAt: note.createdAt,
    });
  }

  async getBytesFromNoteById(id: string): Promise<Uint8Array | null> {
    const note = await this.noteModel
      .findById(id)
      .select('bytes')
      .lean()
      .exec();
    if (!note) return null;
    return new Uint8Array(note.bytes.buffer);
  }
}
