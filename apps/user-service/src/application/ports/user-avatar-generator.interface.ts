export interface IUserAvatarGenerator {
  generate(login: string): string;
}
