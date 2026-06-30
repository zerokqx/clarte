import { INoteClient } from '../application/ports';
import { Observable, map } from 'rxjs';
import { Notes } from '@clarte/shared-contracts/proto';
import { InjectNoteGrpcClient } from '../application/decorators';
import { OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';

export class NoteClient implements INoteClient, OnModuleInit {
  private noteService!: Notes.NotesServiceClient;
  constructor(@InjectNoteGrpcClient() private readonly grpcNoteClient: ClientGrpc) {}

  onModuleInit() {
    this.noteService = this.grpcNoteClient.getService(Notes.NOTES_SERVICE_NAME);
  }

  getNoteById(id: string): Observable<Notes.Note> {
    return this.noteService.getNoteById({ id });
  }

  saveNoteBytes(id: string, authorId: string, bytes: Uint8Array): Observable<void> {
    return this.noteService.saveNoteBytes({ id, authorId, bytes }).pipe(map(() => void {}));
  }
  checkAccess(authorId: string, noteId: string): Observable<Notes.AccessCheckResponse> {
    return this.noteService.accessCheck({ authorId, noteId });
  }

  getBytes(id: string): Observable<Uint8Array> {
    return this.noteService.getBytes({ id }).pipe(map((response) => response.bytes));
  }
}
