import { type Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Универсальная фабрика для создания декораторов параметров из объекта Request.
 * @param reqKey - Ключ в объекте Request (например: 'cookies', 'headers', 'params', 'query', 'user')
 */
export const mkReqPropertyDecorator = <K extends keyof Request>(
  reqKey: K,
) => {
  return createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<Request>();
      const targetSource = request[reqKey];

      if (!targetSource) {
        return undefined;
      }

      return data ? (targetSource as any)[data] : targetSource;
    },
  );
};
