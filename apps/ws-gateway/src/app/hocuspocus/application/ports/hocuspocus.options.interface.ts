import { IJwtValidator } from "./jwt-validator.interface";
import { INoteClient } from "./note.client.interface";

export interface IHocuspocusOptions {
  jwtValidator: IJwtValidator;
  noteClient: INoteClient
}
