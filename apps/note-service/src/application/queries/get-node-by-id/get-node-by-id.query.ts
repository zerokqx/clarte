import { freezeWith } from '@clarte/shared';
import { IQuery } from '@nestjs/cqrs';

export interface GetNodeByIdQueryPayload {
  readonly id: string;
}

export class GetNodeByIdQuery implements IQuery, GetNodeByIdQueryPayload {
  readonly id!: string;
  constructor(public readonly payload: GetNodeByIdQueryPayload) {
    freezeWith(this, payload);
  }
}
