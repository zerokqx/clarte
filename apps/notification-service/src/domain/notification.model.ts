import { Entity } from '@clarte/shared-domain/domain';
import { IdVo, TitleVo, TextVo } from './value-objects';

interface NotificationPlain {
  id: string;
  userId: string;
  title: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export class Notification extends Entity {
  private constructor(
    id: IdVo,
    private readonly _userId: IdVo,
    private _title: TitleVo,
    private _text: TextVo,
    private _isRead: boolean,
    private readonly _createdAt: Date,
  ) {
    super(id.value);
  }

  public get userId(): string {
    return this._userId.value;
  }

  public get title(): string {
    return this._title.value;
  }

  public get text(): string {
    return this._text.value;
  }

  public get isRead(): boolean {
    return this._isRead;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public static create(
    id: string,
    userId: string,
    title: string,
    text: string,
  ): Notification {
    return new Notification(
      IdVo.create(id),
      IdVo.create(userId),
      TitleVo.create(title),
      TextVo.create(text),
      false,
      new Date(),
    );
  }

  public static restore(
    id: string,
    userId: string,
    title: string,
    text: string,
    isRead: boolean,
    createdAt: Date,
  ): Notification {
    return new Notification(
      IdVo.restore(id),
      IdVo.restore(userId),
      TitleVo.restore(title),
      TextVo.restore(text),
      isRead,
      createdAt,
    );
  }

  public markAsRead(): void {
    this._isRead = true;
  }

  override toPlain(): NotificationPlain {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      text: this.text,
      isRead: this.isRead,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
