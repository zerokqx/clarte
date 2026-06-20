import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { type Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COOKIE_NAME } from '@clarte/shared';
import {
  InjectCookieInterceptorOptions,
  InjectCookieInterceptorUuid,
} from '../decorators';

export interface JwtCookieInterceptorOptions {
  isProd: boolean;
}

@Injectable()
export class JwtCookieInterceptor implements NestInterceptor {
  constructor(
    @InjectCookieInterceptorOptions()
    private readonly options: JwtCookieInterceptorOptions,
    @InjectCookieInterceptorUuid()
    private readonly uuid: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        // Проверяем, совпадает ли секретный UUID в возвращаемом значении
        if (data && data.__interceptorUuid === this.uuid) {
          const { accessToken, refreshToken } = data;

          if (accessToken) {
            response.cookie(COOKIE_NAME.JWT_ACCESS, accessToken, {
              httpOnly: true,
              secure: this.options.isProd,
              sameSite: 'lax',
              maxAge: 30 * 60 * 1000, // 30 минут
            });
          }

          if (refreshToken) {
            response.cookie(COOKIE_NAME.JWT_REFRESH, refreshToken, {
              httpOnly: true,
              secure: this.options.isProd,
              sameSite: 'lax',
              maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
            });
          }

          return { success: true };
        }

        return data;
      }),
    );
  }
}
