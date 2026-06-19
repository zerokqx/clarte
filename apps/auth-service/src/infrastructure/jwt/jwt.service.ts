import { Inject, Injectable } from '@nestjs/common';
import { IJwtService } from '@/application';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  type IJwtPayload,
} from '@clarte/shared-contracts/interfaces';
import { TokenVo } from '@/domain';

@Injectable()
export class JwtService implements IJwtService {
  constructor(
    @Inject(NestJwtService)
    private readonly nestJwtService: NestJwtService,
  ) {}
  async generateAccess(payload: IJwtPayload): Promise<TokenVo> {
    const token = await this.nestJwtService.signAsync(
      { ...payload, type: 'access' } as IJwtPayload,
      {
        expiresIn: '30m',
      },
    );
    return TokenVo.create(token);
  }
  async generateRefresh(payload: IJwtPayload): Promise<TokenVo> {
    const token = await this.nestJwtService.signAsync(
      { ...payload, type: 'refresh' } as IJwtPayload,
      {
        expiresIn: '15d',
      },
    );
    return TokenVo.create(token);
  }
  verify(token: string): Promise<IJwtPayload> {
    return this.nestJwtService.verifyAsync<IJwtPayload>(token);
  }
}
