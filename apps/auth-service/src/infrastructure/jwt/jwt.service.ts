import { Inject, Injectable } from '@nestjs/common';
import { IJwtService } from '../../application';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  ITokenPayload,
  ITokenPayloadWithMetadata,
  TokenVo,
} from '../../domain';

@Injectable()
export class JwtService implements IJwtService {
  constructor(
    @Inject(NestJwtService)
    private readonly nestJwtService: NestJwtService,
  ) {}
  async generateAccess(payload: ITokenPayload): Promise<TokenVo> {
    const token = await this.nestJwtService.signAsync(
      { ...payload, type: 'access' } as ITokenPayloadWithMetadata,
      {
        expiresIn: '30m',
      },
    );
    return TokenVo.create(token);
  }
  async generateRefresh(payload: ITokenPayload): Promise<TokenVo> {
    const token = await this.nestJwtService.signAsync(
      { ...payload, type: 'refresh' } as ITokenPayloadWithMetadata,
      {
        expiresIn: '15d',
      },
    );
    return TokenVo.create(token);
  }
  verify(token: string): Promise<ITokenPayload> {
    return this.nestJwtService.verifyAsync<ITokenPayload>(token);
  }
}
