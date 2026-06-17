export class TodoReadModel {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly isCompleted: boolean,
    readonly title: string,
    readonly description: string,
    readonly dueDate: string,
    readonly createdAt: string,
    readonly updatedAt: string,
  ) {}
}
