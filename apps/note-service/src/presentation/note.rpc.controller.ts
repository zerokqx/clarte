import { CreateNoteCommand } from '@/application/commands/create-note';
import { GetBytesQuery, GetNoteByIdQuery } from '@/application/queries';
import { Notes } from '@clarte/shared-contracts/proto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Notes.NotesServiceControllerMethods()
export class NotesController implements Notes.NotesServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createNote(
    request: Notes.CreateNoteRequest,
  ): Promise<Notes.CreateNoteResponse> {
    const bytes = request.bytes ? new Uint8Array(request.bytes) : null;
    const data = await this.commandBus.execute(
      new CreateNoteCommand({ text: request.text, tags: request.tags, authorId: request.authorId, bytes }),
    );
    return { id: data };
  }

  async getBytes(
    request: Notes.GetBytesRequest,
  ): Promise<Notes.GetBytesResponse> {
    const bytes = await this.queryBus.execute<GetBytesQuery, Uint8Array | null>(
      new GetBytesQuery({ id: request.id }),
    );
    if (!bytes) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Note not found',
      });
    }
    return { bytes: Buffer.from(bytes) };
  }

  async getNoteById(request: Notes.GetNoteByIdRequest): Promise<Notes.Note> {
    const note = await this.queryBus.execute(
      new GetNoteByIdQuery({ id: request.id }),
    );
    if (!note) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Note not found',
      });
    }
    return {
      id: note.id,
      text: note.text,
      tags: note.tags,
      authorId: note.authorId,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }

  async saveNoteBytes(request: Notes.SaveNoteBytesRequest): Promise<void> {
    // TODO: Implement save bytes command if not exists
    console.log('Save note bytes requested for note', request.id);
  }
}
