import { ITokenPayload, TokenVo } from '../../domain';

export interface IJwtService {
  generateAccess(payload: ITokenPayload): Promise<TokenVo>;
  generateRefresh(payload: ITokenPayload): Promise<TokenVo>;
  verify(token: string): Promise<ITokenPayload>;
}
