import { Global, Inject, Injectable } from '@nestjs/common';
import { type Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, SecretOrKeyProvider } from 'passport-jwt';
import { COOKIE_NAME } from '@clarte/shared';
import {
  Contracts,
  IJwtPayload,
  IAuthenticatedUser,
  type IJwtKeyProvider,
} from '@clarte/shared-contracts';
import { getRequestCookie } from '@/functions';

@Global()
@Injectable()
export class AccesStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  /** Кэш публичного ключа — запрашивается единожды при первом JWT-запросе */
  private cachedKey: string | null = null;

  constructor(
    @Inject(Contracts.JWT_KEY_PROVIDER)
    private readonly keyProvider: IJwtKeyProvider,
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
          getRequestCookie(req, COOKIE_NAME.JWT_ACCESS) ?? null,
      ]),
    });
  }

  override validate(req: Request, payload: IJwtPayload): IAuthenticatedUser {
    const token = getRequestCookie(req, COOKIE_NAME.JWT_ACCESS) ?? '';
    return {
      ...payload,
      __metadata: {
        processedBy: 'jwt-access',
        original: token,
      },
    };
  }
}
