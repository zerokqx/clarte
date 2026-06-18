import {
  type IJwtPayload,
  IAuthClaims,
} from '@clarte/shared-contracts/interfaces';
import { TokenVo } from '@/domain';

export interface IJwtService {
  generateAccess(payload: IAuthClaims): Promise<TokenVo>;
  generateRefresh(payload: IAuthClaims): Promise<TokenVo>;
  verify(token: string): Promise<IJwtPayload>;
}
