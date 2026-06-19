import { Query } from '@nestjs/cqrs';
import { UserReadModel } from '@/application/models';

export class FindUserByLoginQuery extends Query<UserReadModel > {
  constructor(public readonly login: string) {
    super();
  }
}
