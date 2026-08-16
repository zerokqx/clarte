import { INodeRepositoryRead } from '@/application';
import { NodeReadModel } from '@/application/models';
import { NodeDocument, Node as NodeMongo } from '../entites';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class NodeReadRepository implements INodeRepositoryRead {
  constructor(
    @InjectModel(NodeMongo.name)
    private readonly nodeModel: Model<NodeDocument>,
  ) {}

  async findById(id: string): Promise<NodeReadModel | null> {
    const node = await this.nodeModel.findOne({ _id: id }).select('-bytes').lean().exec();

    if (!node) return null;
    return new NodeReadModel({
      id: node._id,
      label: node.label ?? '',
      content: node.content ?? '',
      tags: node.tags ?? [],
      authorId: node.authorId,
      parentId: node.parentId ?? null,
      linksTo: node.linksTo ?? [],
      type: node.type ?? 'file',
      updatedAt: node.updatedAt,
      createdAt: node.createdAt,
    });
  }

  async getBytesFromNodeById(id: string): Promise<Uint8Array | null> {
    const node = await this.nodeModel.findOne({ _id: id }).select('bytes').lean().exec();

    if (!node || !node.bytes) return null;
    return new Uint8Array(node.bytes.buffer);
  }

  userHasAccessTo(userId: string): (nodeId: string) => Promise<boolean> {
    return async (nodeId: string) =>
      !!(await this.nodeModel.exists({ authorId: userId, _id: nodeId }).exec());
  }

  async getAllUserNodes(userId: string): Promise<NodeReadModel[]> {
    const nodes = await this.nodeModel.find({ authorId: userId }).select('-bytes').lean().exec();

    return nodes.map(
      (node) =>
        new NodeReadModel({
          id: node._id,
          label: node.label ?? '',
          content: node.content ?? '',
          tags: node.tags ?? [],
          authorId: node.authorId,
          parentId: node.parentId ?? null,
          linksTo: node.linksTo ?? [],
          type: node.type ?? 'file',
          updatedAt: node.updatedAt,
          createdAt: node.createdAt,
        }),
    );
  }
}
