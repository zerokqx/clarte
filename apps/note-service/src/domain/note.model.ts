import { Entity } from '@clarte/shared-domain/domain';
import { TextVo } from './value-objects';


type NoteProps = Pick<Note, never>


interface NotePlain {
  id: string;
  text: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
export class Note extends Entity {
  private constructor(
    id: string,
    private _text: TextVo,
    private _tags: string[],
    private _bytes: Uint8Array | null,
    private _authorId: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);
  }

  public static create(id: string, text: string, tags: string[] = [], bytes: Uint8Array | null = null, authorId: string) {
    const now = new Date();
    return new Note(id, TextVo.create(text), tags, bytes, authorId, now, now);
  }

  public static restore(
    id: string,
    text: string,
    tags: string[],
    bytes: Uint8Array | null,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
  ): Note {
    return new Note(id, TextVo.restore(text), tags, bytes, authorId, createdAt, updatedAt);
  }

  changeText(rawNewText: string) {
    const newText = TextVo.create(rawNewText);
    const now = new Date();
    this._text = newText;
    this._updatedAt = now;
  }

  changeTags(tags: string[]) {
    this._tags = tags;
    this._updatedAt = new Date();
  }

  changeBytes(bytes: Uint8Array | null) {
    this._bytes = bytes;
    this._updatedAt = new Date();
  }

  get text(): string {
    return this._text.value;
  }

  get tags(): string[] {
    return this._tags;
  }

  get bytes(): Uint8Array | null {
    return this._bytes;
  }

  get authorId(): string {
    return this._authorId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  override toPlain(): NotePlain {
    return {
      text: this.text,
      tags: this.tags,
      bytes: this.bytes,
      authorId: this.authorId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      id: this.id,
    };
  }
}
