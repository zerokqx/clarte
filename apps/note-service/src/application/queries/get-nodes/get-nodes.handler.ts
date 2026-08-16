import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetNodesQuery } from './get-nodes.query';
import { NodeReadModel } from '@/application/models';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryRead } from '@/application/ports';

@QueryHandler(GetNodesQuery)
export class GetNodesHandler implements IQueryHandler<GetNodesQuery, NodeReadModel[]> {
  constructor(@InjectNodeRepo('r') private readonly nodeReadRepo: INodeRepositoryRead) {}

  async execute(query: GetNodesQuery): Promise<NodeReadModel[]> {
    return this.nodeReadRepo.getAllUserNodes(query.payload.userId);
  }
}
