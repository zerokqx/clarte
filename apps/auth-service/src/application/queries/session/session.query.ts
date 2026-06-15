import { Query } from '@nestjs/cqrs';

export class SessionQuery implements Query<any> {
  constructor() {}
}
