import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'notes', timestamps: true })
export class Note {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: String, required: true, default: '' })
  text!: string;

  @Prop({ type: String, required: true, index: true })
  authorId!: string;

  @Prop({ type: Buffer })
  bytes!: Buffer;

  updatedAt!: Date;
  createdAt!: Date;
}

export type NoteDocument = HydratedDocument<Note>;
export const NoteSchema = SchemaFactory.createForClass(Note);
