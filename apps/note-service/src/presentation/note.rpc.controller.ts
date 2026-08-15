import { CreateNodeCommand } from '@/application/commands/create-node';
import { SaveNoteBytesCommand } from '@/application/commands/save-note-bytes';
import { AccessCheckQuery, GetBytesQuery, GetNodeByIdQuery } from '@/application/queries';
import { Notes } from '@clarte/shared-contracts/proto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { NodeReadModel } from '@/application/models';

@Notes.NotesServiceControllerMethods()
export class NotesController implements Notes.NotesServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createNote(request: Notes.CreateNoteRequest): Promise<Notes.CreateNoteResponse> {
    const bytes = request.bytes ? new Uint8Array(request.bytes) : null;
    const req = request as unknown as {
      label?: string;
      content?: string;
      parentId?: string | null;
      linksTo?: string[];
      type?: 'file' | 'folder';
    };
    const label = req.label || request.text || 'Untitled';
    const content = req.content ?? '';

    const data = await this.commandBus.execute<CreateNodeCommand, string>(
      new CreateNodeCommand({
        label,
        content,
        tags: request.tags,
        authorId: request.authorId,
        bytes,
        parentId: req.parentId,
        linksTo: req.linksTo,
        type: req.type,
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
    const node = await this.queryBus.execute<GetNodeByIdQuery, NodeReadModel | null>(
      new GetNodeByIdQuery({ id: request.id }),
    );
    if (!node) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Node not found',
      });
    }
    return {
      id: node.id,
      text: node.content || node.label,
      tags: node.tags,
      authorId: node.authorId,
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
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
