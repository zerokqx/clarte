import { INodeClient, InjectNodeGrpcClient } from '@/app/node/application';
import { OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { Notes } from '@clarte/shared-contracts/proto';
import { map, Observable } from 'rxjs';
import { makeGrpcMetadata } from '@clarte/shared-nest/core/functions';

export class NodeClient implements INodeClient, OnModuleInit {
  private notesService!: Notes.NotesServiceClient;

  constructor(@InjectNodeGrpcClient() private readonly nodeGrpcClient: ClientGrpc) {}

  onModuleInit() {
    this.notesService = this.nodeGrpcClient.getService(Notes.NOTES_SERVICE_NAME);
  }

  createNode(userId: string, data: Notes.CreateNoteRequest): Observable<Notes.CreateNoteResponse> {
    return this.notesService.createNote(data, makeGrpcMetadata({ userId }));
  }

  getNodeById(id: string): Observable<Notes.Note> {
    return this.notesService.getNoteById({ id });
  }

  getAllUserNodes(userId: string): Observable<Notes.GetAllUserNotesResponse> {
    return this.notesService.getAllUserNotes({}, makeGrpcMetadata({ userId }));
  }

  getBytes(id: string): Observable<Notes.GetBytesResponse> {
    return this.notesService.getBytes({ id });
  }

  saveNoteBytes(userId: string, data: Notes.SaveNoteBytesRequest): Observable<void> {
    return this.notesService
      .saveNoteBytes(data, makeGrpcMetadata({ userId }))
      .pipe(map(() => void 0));
  }

  accessCheck(userId: string, noteId: string): Observable<Notes.AccessCheckResponse> {
    return this.notesService.accessCheck({ noteId }, makeGrpcMetadata({ userId }));
  }
}
