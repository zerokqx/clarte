import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '@/domain';

@Injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  hash(password: string): Promise<string> {
    return argon2.hash(password);
  }
  compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
