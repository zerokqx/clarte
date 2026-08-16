import { Notes } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface INodeClient {
  createNode(userId: string, data: Notes.CreateNoteRequest): Observable<Notes.CreateNoteResponse>;
  getNodeById(id: string): Observable<Notes.Note>;
  getAllUserNodes(userId: string): Observable<Notes.GetAllUserNotesResponse>;
  getBytes(id: string): Observable<Notes.GetBytesResponse>;
  saveNoteBytes(userId: string, data: Notes.SaveNoteBytesRequest): Observable<void>;
  accessCheck(userId: string, noteId: string): Observable<Notes.AccessCheckResponse>;
}
