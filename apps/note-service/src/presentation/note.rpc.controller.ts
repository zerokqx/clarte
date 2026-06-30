import { CreateNoteCommand } from '@/application/commands/create-note';
import { SaveNoteBytesCommand } from '@/application/commands/save-note-bytes';
import { AccessCheckQuery, GetBytesQuery, GetNoteByIdQuery } from '@/application/queries';
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

  async createNote(request: Notes.CreateNoteRequest): Promise<Notes.CreateNoteResponse> {
    const bytes = request.bytes ? new Uint8Array(request.bytes) : null;
    const data = await this.commandBus.execute(
      new CreateNoteCommand({
        text: request.text,
        tags: request.tags,
        authorId: request.authorId,
        bytes,
      }),
    );
    return { id: data };
  }

  async getBytes(request: Notes.GetBytesRequest): Promise<Notes.GetBytesResponse> {
    const bytes = await this.queryBus.execute<GetBytesQuery, Uint8Array | null>(
      new GetBytesQuery({ id: request.id }),
    );
    const responseBytes = bytes ? Buffer.from(bytes.buffer || bytes) : Buffer.alloc(0);
    return { bytes: responseBytes };
  }

  async getNoteById(request: Notes.GetNoteByIdRequest): Promise<Notes.Note> {
    const note = await this.queryBus.execute(new GetNoteByIdQuery({ id: request.id }));
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

  async accessCheck(request: Notes.AccessCheckRequest): Promise<Notes.AccessCheckResponse> {
    const query = new AccessCheckQuery({
      authorId: request.authorId,
      noteId: request.noteId,
    });

    return { status: await this.queryBus.execute(query) };
  }
  async saveNoteBytes(request: Notes.SaveNoteBytesRequest): Promise<void> {
    const bytes = new Uint8Array(request.bytes);
    await this.commandBus.execute(
      new SaveNoteBytesCommand({
        id: request.id,
        bytes,
        authorId: request.authorId,
      }),
    );
  }
}
