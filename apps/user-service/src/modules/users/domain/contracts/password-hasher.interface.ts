export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(oldPassword: string, newPassword: string): Promise<boolean>;
}

export const PASSWORD_HASHER_TOKEN = Symbol('PASSWORD_HASHER_TOKEN');
