import type { CrqsRepository } from '@clarte/shared-nest/core/types';
import { Node } from '@/domain';
import { NodeReadModel } from '../models';

export interface INodeRepositoryWrite {
  save(node: Node): Promise<void>;
  findById(id: string): Promise<Node | null>;
}

export interface INodeRepositoryRead {
  findById(id: string): Promise<NodeReadModel | null>;
  getBytesFromNodeById(id: string): Promise<Uint8Array | null>;
  userHasAccessTo(userId: string): (nodeId: string) => Promise<boolean>;
  getAllUserNodes(userId: string): Promise<NodeReadModel[]>;
}

export type INodeRepository = CrqsRepository<INodeRepositoryRead, INodeRepositoryWrite>;

// Aliases for compatibility
export type INoteRepositoryWrite = INodeRepositoryWrite;
export type INoteRepositoryRead = INodeRepositoryRead;
export type INoteRepository = INodeRepository;
