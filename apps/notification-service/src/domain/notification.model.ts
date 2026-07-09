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

interface NotificationProps {
  id: IdVo;
  userId: IdVo;
  title: TitleVo;
  text: TextVo;
  isRead: boolean;
  createdAt: Date;
}

interface CreateNotificationDto {
  id: string;
  userId: string;
  title: string;
  text: string;
}

interface RestoreNotificationDto extends CreateNotificationDto {
  isRead: boolean;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  private constructor(props: NotificationProps) {
    super(props);
  }

  public get userId(): string {
    return this._props.userId.value;
  }

  public get title(): string {
    return this._props.title.value;
  }

  public get text(): string {
    return this._props.text.value;
  }

  public get isRead(): boolean {
    return this._props.isRead;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public static create(dto: CreateNotificationDto): Notification {
    return new Notification({
      id: IdVo.create(dto.id),
      userId: IdVo.create(dto.userId),
      title: TitleVo.create(dto.title),
      text: TextVo.create(dto.text),
      isRead: false,
      createdAt: new Date(),
    });
  }

  public static restore(dto: RestoreNotificationDto): Notification {
    return new Notification({
      id: IdVo.restore(dto.id),
      userId: IdVo.restore(dto.userId),
      title: TitleVo.restore(dto.title),
      text: TextVo.restore(dto.text),
      isRead: dto.isRead,
      createdAt: dto.createdAt,
    });
  }

  public markAsRead(): void {
    this._props.isRead = true;
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
