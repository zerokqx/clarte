import { freezeWith } from '@clarte/shared';
import { IQuery } from '@nestjs/cqrs';

export interface GetNodesQueryPayload {
  readonly userId: string;
}

export class GetNodesQuery implements IQuery, GetNodesQueryPayload {
  readonly userId!: string;
  constructor(public readonly payload: GetNodesQueryPayload) {
    freezeWith(this, payload);
  }
}
