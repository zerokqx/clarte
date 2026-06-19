import { Entity } from '@clarte/shared-domain/domain';
import { TextVo } from './value-objects';

interface NotePlain {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
export class Note extends Entity {
  private constructor(
    id: string,
    private _text: TextVo,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);
  }

  public static create(id: string, text: string) {
    const now = new Date();
    return new Note(id, TextVo.create(text), now, now);
  }

  public static restore(
    id: string,
    text: string,
    createdAt: Date,
    updatedAt: Date,
  ): Note {
    return new Note(id, TextVo.restore(text), createdAt, updatedAt);
  }

  changeText(rawNewText: string) {
    const newText = TextVo.create(rawNewText);
    const now = new Date();
    this._text = newText;
    this._updatedAt = now;
  }

  get text(): string {
    return this._text.value;
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
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      id: this.id,
    };
  }
}
