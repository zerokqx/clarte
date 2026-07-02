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

interface GrpcMetadataLike {
  get?: (key: string) => unknown;
  internalRepr?: {
    get?: (key: string) => unknown;
  };
}

export function safeMetadataGrpcGetter(metadata: unknown) {
  return <F = undefined>(field: string, fallback?: F): (string | Buffer)[] | F => {
    if (!metadata || typeof metadata !== 'object') {
      return fallback as F;
    }

    const meta = metadata as GrpcMetadataLike;
    let value: unknown;

    if (typeof meta.get === 'function') {
      value = meta.get(field);
    } else if (
      meta.internalRepr &&
      typeof meta.internalRepr === 'object' &&
      typeof meta.internalRepr.get === 'function'
    ) {
      value = meta.internalRepr.get(field);
    }

    if (Array.isArray(value)) {
      return (value.length > 0 ? value : fallback) as (string | Buffer)[] | F;
    }

    if (value !== undefined && value !== null) {
      return [value] as (string | Buffer)[] | F;
    }

    return fallback as F;
  };
}
