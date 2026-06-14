import { Query } from '@nestjs/cqrs';

export class GetPublicJwtKeyQuery extends Query<string> {
  constructor() {
    super();
  }
}
