import { INodeRepositoryWrite } from '@/application';
import { Node } from '@/domain';
import { InjectModel } from '@nestjs/mongoose';
import { NodeDocument, Node as NodeMongo } from '../entites';
import { Model } from 'mongoose';

export class NodeWriteRepository implements INodeRepositoryWrite {
  constructor(
    @InjectModel(NodeMongo.name)
    private readonly nodeModel: Model<NodeDocument>,
  ) {}

  async findById(id: string): Promise<Node | null> {
    const doc = await this.nodeModel.findById(id).lean().exec();
    if (!doc) return null;

    return Node.restore({
      id: doc._id,
      label: doc.label,
      content: doc.content,
      tags: doc.tags,
      bytes: doc.bytes ? new Uint8Array(doc.bytes.buffer) : null,
      authorId: doc.authorId,
      parentId: doc.parentId ?? null,
      linksTo: doc.linksTo ?? [],
      type: doc.type ?? 'file',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async save(node: Node): Promise<void> {
    await this.nodeModel.updateOne(
      { _id: node.id },
      {
        label: node.label,
        content: node.content,
        bytes: node.bytes ? Buffer.from(node.bytes) : null,
        authorId: node.authorId,
        parentId: node.parentId,
        linksTo: node.linksTo,
        type: node.type,
        tags: node.tags,
        updatedAt: node.updatedAt,
      },
      { upsert: true },
    );
  }
}
