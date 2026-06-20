export class CredentialsReadModel {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly passwordHash: string,
  ) {}
}
