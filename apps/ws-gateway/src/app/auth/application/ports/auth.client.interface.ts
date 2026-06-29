import { Observable } from 'rxjs';
export interface IAuthClient {
  getPublicKey(): Observable<string>;
}
