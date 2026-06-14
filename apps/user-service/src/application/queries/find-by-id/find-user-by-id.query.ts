import { Query } from '@nestjs/cqrs';
import { UserReadModel } from '../../models';

export class FindUserByIdQuery extends Query<UserReadModel > {
  constructor(public readonly id: string) {
    super();
  }
}
