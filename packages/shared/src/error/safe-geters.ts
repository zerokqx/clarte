import { get } from 'radash';
import { TypeofValue } from '../types';

export function safeGeter<DT = string>(key: string, expectedType?: TypeofValue) {
  const resolveTypeExpected = expectedType ?? 'string';

  return function <F = undefined>(fallback?: F) {
    return function (error: unknown): F extends undefined ? DT | undefined : DT | F {
      if (error && typeof error === 'object') {
        const value = get<unknown>(error, key);

        if (typeof value === resolveTypeExpected) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return value as any;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fallback as any;
    };
  };
}

export const errorMessage = safeGeter('message');
export const errorStatusCode = safeGeter('statusCode');
export const errorCode = safeGeter<number>('code');
