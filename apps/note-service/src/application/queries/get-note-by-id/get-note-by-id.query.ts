import { IQuery } from '@nestjs/cqrs';

export type GetNoteByIdQueryProps = Omit<GetNoteByIdQuery, never>;

export class GetNoteByIdQuery implements IQuery {
  public readonly id!: string;

  constructor(props: GetNoteByIdQueryProps) {
    Object.assign(this, props);
  }
}
