import { IQuery } from '@nestjs/cqrs';

export class GetBytesQuery implements IQuery {
  constructor(public readonly id: string) {}
}
