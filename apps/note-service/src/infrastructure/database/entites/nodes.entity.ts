import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'nodes', timestamps: true })
export class Node {
  @Prop({ type: String, required: true, immutable: true })
  _id!: string;

  @Prop({ type: String, required: true, default: '' })
  label!: string;

  @Prop({ type: String, required: false, default: '' })
  content!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: String, required: true, index: true, immutable: true })
  authorId!: string;

  @Prop({ type: String, required: false, index: true, default: null })
  parentId!: string | null;

  @Prop({ type: [String], default: [] })
  linksTo!: string[];

  @Prop({ type: String, enum: ['file', 'folder'], default: 'file' })
  type!: 'file' | 'folder';

  @Prop({
    type: Buffer,
    required: false,
    default: () => Buffer.alloc(0),
  })
  bytes!: Buffer;

  updatedAt!: Date;
  createdAt!: Date;
}

export type NodeDocument = HydratedDocument<Node>;
export const NodeSchema = SchemaFactory.createForClass(Node);
