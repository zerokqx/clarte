import { Entity } from '@clarte/shared-domain/domain';
import { DescriptionVo, DueDateVo, IdVo } from './value-objects';
import { TitleVo } from './value-objects/title.vo';

interface TodoPlain {
  id: string;
  userId: string;
  isCompleted: boolean; // Добавлено в интерфейс, так как оно есть в сущности
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export class Todo extends Entity {
  private constructor(
    id: IdVo,
    private readonly _userId: IdVo,
    private _isCompleted: boolean,
    private _title: TitleVo,
    private _description: DescriptionVo,
    private _dueDate: DueDateVo,
    private readonly _createdAt: Date, // Исправлен синтаксис (убрали лишний _)
    private _updatedAt: Date,
  ) {
    super(id.value);
  }

  // --- ГЕТТЕРЫ ---

  public get userId(): string {
    return this._userId.value;
  }

  public get isCompleted(): boolean {
    return this._isCompleted;
  }

  public get title(): string {
    return this._title.value;
  }

  public get description(): string {
    return this._description.value;
  }

  public get dueDate(): Date {
    return this._dueDate.value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // --- ФАБРИЧНЫЕ МЕТОДЫ ---

  public static create(
    id: string,
    userId: string,
    isCompleted: boolean,
    title: string,
    description: string,
    dueDate: Date,
  ): Todo {
    return new Todo(
      IdVo.create(id),
      IdVo.create(userId),
      isCompleted,
      TitleVo.create(title),
      DescriptionVo.create(description),
      DueDateVo.create(dueDate),
      new Date(),
      new Date(),
    );
  }

  public static restore(
    id: string,
    userId: string,
    isCompleted: boolean,
    title: string,
    description: string,
    dueDate: Date,
    createdAt: Date,
    updatedAt: Date,
  ): Todo {
    return new Todo(
      IdVo.restore(id),
      IdVo.restore(userId),
      isCompleted,
      TitleVo.restore(title),
      DescriptionVo.restore(description),
      DueDateVo.restore(dueDate),
      createdAt,
      updatedAt,
    );
  }

  private renewUpdateAt() {
    this._updatedAt = new Date();
  }

  changeIsCompleted(status: boolean) {
    if (typeof status === 'boolean') this._isCompleted = status;
    this.renewUpdateAt();
  }

  changeTitle(rawTitle: string) {
    const title = TitleVo.create(rawTitle);
    this._title = title;
    this.renewUpdateAt();
  }
  changeDescription(rawDescription: string) {
    const description = DescriptionVo.create(rawDescription);
    this._description = description;
    this.renewUpdateAt();
  }

  changeDueDate(rawDueDate: Date) {
    const dueDate = DueDateVo.create(rawDueDate);
    this._dueDate = dueDate;
    this.renewUpdateAt();
  }

  override toPlain(): TodoPlain {
    return {
      id: this.id, // Использует id из базового класса Entity
      userId: this.userId,
      isCompleted: this.isCompleted,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate.toISOString(), // Конвертация Date в string
      createdAt: this.createdAt.toISOString(), // Конвертация Date в string
      updatedAt: this.updatedAt.toISOString(), // Конвертация Date в string
    };
  }
}
