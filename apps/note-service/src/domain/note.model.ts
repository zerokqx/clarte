import { Entity } from '@clarte/shared-domain/domain';
import { TextVo } from './value-objects';

interface NotePlain {
  id: string;
  text: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId: string | null;
  linksTo: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteProps {
  id: string;
  text: TextVo;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId: string | null;
  linksTo: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateNoteDto {
  id: string;
  text: string;
  tags?: string[];
  bytes?: Uint8Array | null;
  authorId: string;
  parentId?: string | null;
  linksTo?: string[];
}

interface RestoreNoteDto {
  id: string;
  text: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  parentId?: string | null;
  linksTo?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Note extends Entity<NoteProps> {
  private constructor(props: NoteProps) {
    super(props);
  }

  public static create(dto: CreateNoteDto): Note {
    const now = new Date();
    return new Note({
      id: dto.id,
      text: TextVo.create(dto.text),
      tags: dto.tags ?? [],
      bytes: dto.bytes ?? null,
      authorId: dto.authorId,
      parentId: dto.parentId ?? null,
      linksTo: dto.linksTo ?? [],
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(dto: RestoreNoteDto): Note {
    return new Note({
      id: dto.id,
      text: TextVo.restore(dto.text),
      tags: dto.tags,
      bytes: dto.bytes,
      authorId: dto.authorId,
      parentId: dto.parentId ?? null,
      linksTo: dto.linksTo ?? [],
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  changeText(rawNewText: string) {
    const newText = TextVo.create(rawNewText);
    this._props.text = newText;
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

  get text(): string {
    return this._props.text.value;
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

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  override toPlain(): NotePlain {
    return {
      text: this.text,
      tags: this.tags,
      bytes: this.bytes,
      authorId: this.authorId,
      parentId: this.parentId,
      linksTo: this.linksTo,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      id: this.id,
    };
  }
}
