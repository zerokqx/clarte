export class UserReadModel {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly avatarUrl: string,
  ) {}
}
