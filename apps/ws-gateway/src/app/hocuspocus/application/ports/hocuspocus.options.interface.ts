import { IJwtValidator } from "./jwt-validator.interface";
import { INoteAccessChecker } from "./note.client.interface";

export interface IHocuspocusOptions {
  jwtValidator: IJwtValidator;
  noteAccessChecker: INoteAccessChecker
}
