import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNoteByIdQuery } from './get-note-by-id.query';
import { NoteReadModel } from '@/application/models';
import { InjectNoteRepo } from '@/application/decorators';
import type { INoteRepositoryRead } from '@/application/ports';

@QueryHandler(GetNoteByIdQuery)
export class GetNoteByIdHandler implements IQueryHandler<GetNoteByIdQuery, NoteReadModel | null> {
  constructor(
    @InjectNoteRepo.read() private readonly noteReadRepo: INoteRepositoryRead,
  ) {}

  async execute(query: GetNoteByIdQuery): Promise<NoteReadModel | null> {
    return this.noteReadRepo.findById(query.id);
  }
}
