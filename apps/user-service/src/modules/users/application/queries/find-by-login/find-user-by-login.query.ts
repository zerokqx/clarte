import { Query } from '@nestjs/cqrs';
import { User } from '../../../domain/user.model';

export class FindUserByLoginQuery extends Query<User | null> {
  constructor(public readonly login: string) {
    super();
  }
}
