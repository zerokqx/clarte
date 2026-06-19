import { Inject, Injectable, Global } from '@nestjs/common';
import { type Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, SecretOrKeyProvider } from 'passport-jwt';
import { COOKIE_NAME } from '@clarte/shared';
import { JWT_KEY_PROVIDER } from '@clarte/shared-contracts/di-tokens';
import {
  type IJwtPayload,
  type IAuthenticatedUser,
  type IJwtKeyProvider,
} from '@clarte/shared-contracts/interfaces';
import { getRequestCookie } from '@/functions';

@Global()
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  /** Кэш публичного ключа — запрашивается единожды при первом JWT-запросе */
  private cachedKey: string | null = null;

  constructor(
    @Inject(JWT_KEY_PROVIDER)
    keyProvider: IJwtKeyProvider,
  ) {
    const secretOrKeyProvider: SecretOrKeyProvider = async (
      _req,
      _rawJwtToken,
      done,
    ) => {
      try {
        if (!this.cachedKey) {
          this.cachedKey = await keyProvider.get();
        }
        done(null, this.cachedKey);
      } catch (err) {
        done(err as Error);
      }
    };

    super({
      secretOrKeyProvider,
      passReqToCallback: true,
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          getRequestCookie(req, COOKIE_NAME.JWT_REFRESH) ?? null,
      ]),
    });
  }

  override validate(req: Request, payload: IJwtPayload): IAuthenticatedUser {
    const token = getRequestCookie(req, COOKIE_NAME.JWT_REFRESH) ?? '';
    return {
      ...payload,
      __metadata: {
        original: token,
        processedBy: 'jwt-refresh',
      },
    };
  }
}
