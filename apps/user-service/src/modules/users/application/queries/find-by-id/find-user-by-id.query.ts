import { Query } from '@nestjs/cqrs';
import { User } from '../../../domain/user.model';

export class FindUserByIdQuery extends Query<User | null> {
  constructor(public readonly id: string) {
    super();
  }
}
