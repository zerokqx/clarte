import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBytesQuery } from './get-bytes.query';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryRead } from '@/application/ports';

@QueryHandler(GetBytesQuery)
export class GetBytesHandler implements IQueryHandler<GetBytesQuery, Uint8Array | null> {
  constructor(@InjectNodeRepo('r') private readonly nodeReadRepo: INodeRepositoryRead) {}

  async execute(query: GetBytesQuery): Promise<Uint8Array | null> {
    return this.nodeReadRepo.getBytesFromNodeById(query.id);
  }
}
