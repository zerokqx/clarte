import { Entity } from '@clarte/shared-domain/domain';
import { LabelVo } from './value-objects';

export type NodeType = 'file' | 'folder';

export interface NodePlain {
  id: string;
  label: string;
  content: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId: string | null;
  linksTo: string[];
  type: NodeType;
  createdAt: Date;
  updatedAt: Date;
}

export interface NodeProps {
  id: string;
  label: LabelVo;
  content: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId: string | null;
  linksTo: string[];
  type: NodeType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNodeDto {
  id: string;
  label: string;
  content?: string;
  tags?: string[];
  bytes?: Uint8Array | null;
  authorId: string;
  parentId?: string | null;
  linksTo?: string[];
  type?: NodeType;
}

export interface RestoreNodeDto {
  id: string;
  label: string;
  content?: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId?: string | null;
  linksTo?: string[];
  type?: NodeType;
  createdAt: Date;
  updatedAt: Date;
}

export class Node extends Entity<NodeProps> {
  private constructor(props: NodeProps) {
    super(props);
  }

  public static create(dto: CreateNodeDto): Node {
    const now = new Date();
    return new Node({
      id: dto.id,
      label: LabelVo.create(dto.label),
      content: dto.content ?? '',
      tags: dto.tags ?? [],
      bytes: dto.bytes ?? null,
      authorId: dto.authorId,
      parentId: dto.parentId ?? null,
      linksTo: dto.linksTo ?? [],
      type: dto.type ?? 'file',
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(dto: RestoreNodeDto): Node {
    return new Node({
      id: dto.id,
      label: LabelVo.restore(dto.label),
      content: dto.content ?? '',
      tags: dto.tags,
      bytes: dto.bytes,
      authorId: dto.authorId,
      parentId: dto.parentId ?? null,
      linksTo: dto.linksTo ?? [],
      type: dto.type ?? 'file',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  changeLabel(rawNewLabel: string) {
    const newLabel = LabelVo.create(rawNewLabel);
    this._props.label = newLabel;
    this._props.updatedAt = new Date();
  }

  changeContent(content: string) {
    this._props.content = content;
    this._props.updatedAt = new Date();
  }

  changeTags(tags: string[]) {
    this._props.tags = tags;
    this._props.updatedAt = new Date();
  }

  changeBytes(bytes: Uint8Array | null) {
    this._props.bytes = bytes;
    this._props.updatedAt = new Date();
  }

  changeParentId(parentId: string | null) {
    this._props.parentId = parentId;
    this._props.updatedAt = new Date();
  }

  changeLinksTo(linksTo: string[]) {
    this._props.linksTo = linksTo;
    this._props.updatedAt = new Date();
  }

  changeType(type: NodeType) {
    this._props.type = type;
    this._props.updatedAt = new Date();
  }

  get label(): string {
    return this._props.label.value;
  }

  get content(): string {
    return this._props.content;
  }

  get tags(): string[] {
    return this._props.tags;
  }

  get bytes(): Uint8Array | null {
    return this._props.bytes;
  }

  get authorId(): string {
    return this._props.authorId;
  }

  get parentId(): string | null {
    return this._props.parentId;
  }

  get linksTo(): string[] {
    return this._props.linksTo;
  }

  get type(): NodeType {
    return this._props.type;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  override toPlain(): NodePlain {
    return {
      label: this.label,
      content: this.content,
      tags: this.tags,
      bytes: this.bytes,
      authorId: this.authorId,
      parentId: this.parentId,
      linksTo: this.linksTo,
      type: this.type,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      id: this.id,
    };
  }
}
