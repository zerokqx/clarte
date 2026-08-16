import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccessCheckQuery } from './access-check.query';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryRead } from '@/application/ports';

@QueryHandler(AccessCheckQuery)
export class AccessCheckHandler implements IQueryHandler<AccessCheckQuery, boolean> {
  constructor(@InjectNodeRepo('r') private readonly nodeReadRepo: INodeRepositoryRead) {}

  async execute(query: AccessCheckQuery): Promise<boolean> {
    return this.nodeReadRepo.userHasAccessTo(query.authorId)(query.noteId);
  }
}
