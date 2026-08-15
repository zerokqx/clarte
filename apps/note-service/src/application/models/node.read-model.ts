import { NodeType } from '@/domain';

export type NodeReadModelProps = Omit<NodeReadModel, never>;

export class NodeReadModel {
  readonly id!: string;
  readonly label!: string;
  readonly content?: string;
  readonly tags!: string[];
  readonly authorId!: string;
  readonly parentId?: string | null;
  readonly linksTo?: string[];
  readonly type?: NodeType;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  constructor(props: NodeReadModelProps) {
    Object.assign(this, props);
  }
}
