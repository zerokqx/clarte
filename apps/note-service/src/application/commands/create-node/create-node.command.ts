import { Command } from '@nestjs/cqrs';
import { NodeType } from '@/domain';

export type CreateNodeCommandProps = {
  label: string;
  content?: string;
  tags?: string[];
  bytes?: Uint8Array | null;
  authorId: string;
  parentId?: string | null;
  linksTo?: string[];
  type?: NodeType;
};

export class CreateNodeCommand extends Command<string> implements CreateNodeCommandProps {
  public readonly label!: string;
  public readonly content?: string;
  public readonly tags?: string[];
  public readonly bytes?: Uint8Array | null;
  public readonly authorId!: string;
  public readonly parentId?: string | null;
  public readonly linksTo?: string[];
  public readonly type?: NodeType;

  constructor(props: CreateNodeCommandProps) {
    super();
    Object.assign(this, props);
  }
}
