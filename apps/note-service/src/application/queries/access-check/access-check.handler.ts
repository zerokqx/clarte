import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AccessCheckQuery } from './access-check.query';
import { InjectNoteRepo } from '@/application/decorators';
import { INoteRepository } from '@/application/ports';
import { CqrsRepoType } from '@clarte/shared-nest/types';

@QueryHandler(AccessCheckQuery)
export class AccessCheckHandler implements IQueryHandler<AccessCheckQuery> {
  constructor(
    @InjectNoteRepo('r')
    private readonly repoRead: INoteRepository[CqrsRepoType.r],
  ) {}

  execute(query: AccessCheckQuery): Promise<boolean> {
    const checker = this.repoRead.userHasAccessTo(query.authorId);
    return checker(query.noteId);
  }
}
