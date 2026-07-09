import { Entity } from '@clarte/shared-domain/domain';
import { DescriptionVo, DueDateVo, IdVo } from './value-objects';
import { TitleVo } from './value-objects/title.vo';

export interface TodoPlain {
  id: string;
  userId: string;
  isCompleted: boolean;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// 1. Описываем внутренние типизированные пропсы для конструктора
interface TodoProps {
  id: IdVo;
  userId: IdVo;
  isCompleted: boolean;
  title: TitleVo;
  description: DescriptionVo;
  dueDate: DueDateVo;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// 2. Описываем чистые сырые типы для фабричных методов
interface CreateTodoDto {
  id: string;
  userId: string;
  isCompleted: boolean;
  title: string;
  description: string;
  dueDate: Date;
}

interface RestoreTodoDto extends CreateTodoDto {
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Todo extends Entity<TodoProps> {
  private constructor(props: TodoProps) {
    super(props);
  }

  // --- ГЕТТЕРЫ (теперь аккуратно смотрят в объект _props) ---

  public get userId(): string {
    return this._props.userId.value;
  }
  public get isDeleted(): boolean {
    return this._props.isDeleted;
  }
  public get isCompleted(): boolean {
    return this._props.isCompleted;
  }
  public get title(): string {
    return this._props.title.value;
  }
  public get description(): string {
    return this._props.description.value;
  }
  public get dueDate(): Date {
    return this._props.dueDate.value;
  }
  public get createdAt(): Date {
    return this._props.createdAt;
  }
  public get updatedAt(): Date {
    return this._props.updatedAt;
  }

  // --- ФАБРИЧНЫЕ МЕТОДЫ (принимают объекты) ---

  public static create(dto: CreateTodoDto): Todo {
    return new Todo({
      id: IdVo.create(dto.id),
      userId: IdVo.create(dto.userId),
      isCompleted: dto.isCompleted,
      title: TitleVo.create(dto.title),
      description: DescriptionVo.create(dto.description),
      dueDate: DueDateVo.create(dto.dueDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
  }

  public static restore(dto: RestoreTodoDto): Todo {
    return new Todo({
      id: IdVo.restore(dto.id),
      userId: IdVo.restore(dto.userId),
      isCompleted: dto.isCompleted,
      title: TitleVo.restore(dto.title),
      description: DescriptionVo.restore(dto.description),
      dueDate: DueDateVo.restore(dto.dueDate),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isDeleted: dto.isDeleted,
    });
  }

  // --- МЕТОДЫ ИЗМЕНЕНИЯ СОСТОЯНИЯ ---

  private renewUpdateAt() {
    this._props.updatedAt = new Date();
  }

  public changeTitle(rawTitle: string): void {
    this._props.title = TitleVo.create(rawTitle);
    this.renewUpdateAt();
  }

  public completed(): void {
    this._props.isCompleted = true;
    this.renewUpdateAt();
  }

  public uncompleted(): void {
    this._props.isCompleted = false;
    this.renewUpdateAt();
  }

  public delete(): void {
    this._props.isDeleted = true;
    this.renewUpdateAt();
  }

  public changeDescription(rawDescription: string): void {
    this._props.description = DescriptionVo.create(rawDescription);
    this.renewUpdateAt();
  }

  public changeDueDate(rawDueDate: Date): void {
    this._props.dueDate = DueDateVo.create(rawDueDate);
    this.renewUpdateAt();
  }

  override toPlain(): TodoPlain {
    return {
      id: this.id,
      userId: this.userId,
      isCompleted: this.isCompleted,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
