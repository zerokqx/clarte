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

  async createNote(request: Notes.CreateNoteRequest): Promise<void> {
    const bytes = request.bytes ? new Uint8Array(request.bytes) : null;
    await this.commandBus.execute(new CreateNoteCommand(request.text, request.tags, bytes));
    return {} as any;
  }

  async getBytes(request: Notes.GetBytesRequest): Promise<Notes.GetBytesResponse> {
    const bytes = await this.queryBus.execute<GetBytesQuery, Uint8Array | null>(new GetBytesQuery(request.id));
    if (!bytes) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'Note not found' });
    }
    return { bytes: Buffer.from(bytes) };
  }

  async getNoteById(request: Notes.GetBytesRequest): Promise<Notes.Note> {
    const note = await this.queryBus.execute(new GetNoteByIdQuery(request.id));
    if (!note) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'Note not found' });
    }
    return {
      id: note.id,
      tags: note.tags,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }
}
