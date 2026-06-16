import { Inject, Injectable } from '@nestjs/common';
import { IJwtService } from '@/application';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  type IJwtPayload,
  type ITokenPayloadWithMetadata,
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
      { ...payload, type: 'access' } as ITokenPayloadWithMetadata,
      {
        expiresIn: '30m',
      },
    );
    return TokenVo.create(token);
  }
  async generateRefresh(payload: IJwtPayload): Promise<TokenVo> {
    const token = await this.nestJwtService.signAsync(
      { ...payload, type: 'refresh' } as ITokenPayloadWithMetadata,
      {
        expiresIn: '15d',
      },
    );
    return TokenVo.create(token);
  }
  verify(token: string): Promise<ITokenPayloadWithMetadata> {
    return this.nestJwtService.verifyAsync<ITokenPayloadWithMetadata>(token);
  }
}
