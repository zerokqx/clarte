import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBytesQuery } from './get-bytes.query';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryRead } from '@/application/ports';

@QueryHandler(GetBytesQuery)
export class GetBytesHandler implements IQueryHandler<GetBytesQuery, Uint8Array | null> {
  constructor(@InjectNoteRepo('r') private readonly noteReadRepo: INoteRepositoryRead) {}

  async execute(query: GetBytesQuery): Promise<Uint8Array | null> {
    const d = await this.noteReadRepo.getBytesFromNoteById(query.id);

    console.log(d, query);
    return d;
  }
}
