import { IQuery } from '@nestjs/cqrs';
import { NoteReadModel } from '@/application/models';

export class GetNoteByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
