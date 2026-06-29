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
      .findOne({ _id: id })
      .select('-bytes -text')
      .lean()
      .exec();

    console.log(note);
    if (!note) return null;
    return new NoteReadModel({
      id: note._id,
      tags: note.tags,
      authorId: note.authorId,
      updatedAt: note.updatedAt,
      createdAt: note.createdAt,
    });
  }

  async getBytesFromNoteById(id: string): Promise<Uint8Array | null> {
    const note = await this.noteModel
      .findOne({ _id: id })
      .select('bytes')
      .lean()
      .exec();

    console.log(note);
    if (!note || !note.bytes) return null;
    return new Uint8Array(note.bytes.buffer);
  }
}
