export class NotificationReadModel {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly title: string,
    readonly text: string,
    readonly isRead: boolean,
    readonly createdAt: string,
  ) {}
}
