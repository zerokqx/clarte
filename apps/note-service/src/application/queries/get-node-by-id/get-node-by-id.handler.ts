import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNodeByIdQuery } from './get-node-by-id.query';
import { NodeReadModel } from '@/application/models';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryRead } from '@/application/ports';

@QueryHandler(GetNodeByIdQuery)
export class GetNodeByIdHandler implements IQueryHandler<GetNodeByIdQuery, NodeReadModel | null> {
  constructor(@InjectNodeRepo('r') private readonly nodeReadRepo: INodeRepositoryRead) {}

  async execute(query: GetNodeByIdQuery): Promise<NodeReadModel | null> {
    return this.nodeReadRepo.findById(query.payload.id);
  }
}
