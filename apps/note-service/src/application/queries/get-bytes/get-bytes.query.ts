import { IQuery } from '@nestjs/cqrs';

export type GetBytesQueryProps = Omit<GetBytesQuery, never>;

export class GetBytesQuery implements IQuery {
  public readonly id!: string;

  constructor(props: GetBytesQueryProps) {
    Object.assign(this, props);
  }
}
