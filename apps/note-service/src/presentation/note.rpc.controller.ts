import { CreateNodeCommand } from '@/application/commands/create-node';
import { SaveNoteBytesCommand } from '@/application/commands/save-note-bytes';
import {
  AccessCheckQuery,
  GetBytesQuery,
  GetNodeByIdQuery,
  GetNodesQuery,
} from '@/application/queries';
import { Notes } from '@clarte/shared-contracts/proto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { NodeReadModel } from '@/application/models';
import { getUserIdFromGrpcMetadata } from '@clarte/shared-nest/core/functions';

@Notes.NotesServiceControllerMethods()
export class NotesController implements Notes.NotesServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createNote(
    request: Notes.CreateNoteRequest,
    metadata?: Metadata,
  ): Promise<Notes.CreateNoteResponse> {
    const authorId = getUserIdFromGrpcMetadata(metadata);
    const bytes = request.bytes ? new Uint8Array(request.bytes) : null;
    const data = await this.commandBus.execute<CreateNodeCommand, string>(
      new CreateNodeCommand({
        label: request.label,
        content: request.content,
        tags: request.tags,
        authorId,
        bytes,
        parentId: request.parentId,
        linksTo: request.linksTo,
        type: request.type as 'file' | 'folder' | undefined,
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
      label: node.label,
      content: node.content,
      tags: node.tags,
      authorId: node.authorId,
      parentId: node.parentId ?? undefined,
      linksTo: node.linksTo ?? [],
      type: node.type ?? 'file',
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
      bytes: undefined,
    };
  }

  async getAllUserNotes(
    _request: unknown,
    metadata?: Metadata,
  ): Promise<Notes.GetAllUserNotesResponse> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    const nodes = await this.queryBus.execute<GetNodesQuery, NodeReadModel[]>(
      new GetNodesQuery({ userId }),
    );
    return {
      notes: nodes.map((node) => ({
        id: node.id,
        label: node.label,
        content: node.content,
        tags: node.tags,
        authorId: node.authorId,
        parentId: node.parentId ?? undefined,
        linksTo: node.linksTo ?? [],
        type: node.type ?? 'file',
        createdAt: node.createdAt.toISOString(),
        updatedAt: node.updatedAt.toISOString(),
        bytes: undefined,
      })),
    };
  }

  async accessCheck(
    request: Notes.AccessCheckRequest,
    metadata?: Metadata,
  ): Promise<Notes.AccessCheckResponse> {
    const authorId = getUserIdFromGrpcMetadata(metadata);
    const query = new AccessCheckQuery({
      authorId,
      noteId: request.noteId,
    });

    return { status: await this.queryBus.execute(query) };
  }

  async saveNoteBytes(request: Notes.SaveNoteBytesRequest, metadata?: Metadata): Promise<void> {
    const authorId = getUserIdFromGrpcMetadata(metadata);
    const bytes = new Uint8Array(request.bytes);
    await this.commandBus.execute(
      new SaveNoteBytesCommand({
        id: request.id,
        bytes,
        authorId,
      }),
    );
  }
}
