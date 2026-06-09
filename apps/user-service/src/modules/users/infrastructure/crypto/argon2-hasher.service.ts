import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../domain/contracts/password-hasher.interface';

export class Argon2HasherService implements IPasswordHasher {
  verify(oldPassword: string, newPassword: string): Promise<boolean> {
    return argon2.verify(oldPassword, newPassword);
  }
  hash(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
