import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { TokenVo } from '@/domain';

export interface IJwtService {
  generateAccess(payload: IJwtPayload): Promise<TokenVo>;
  generateRefresh(payload: IJwtPayload): Promise<TokenVo>;
  verify(token: string): Promise<IJwtPayload>;
}
