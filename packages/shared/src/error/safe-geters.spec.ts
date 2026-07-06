import { describe, it, expect } from 'vitest';
import {
  safeGeter,
  errorMessage,
  errorStatusCode,
  errorCode,
  safeMetadataGrpcGetter,
} from './safe-geters';

describe('safe-geters helpers', () => {
  describe('safeGeter', () => {
    it('should retrieve nested field and fallback correctly', () => {
      const getCode = safeGeter<number>('code', 'number')('default');
      expect(getCode({ code: 500 })).toBe(500);
      expect(getCode({ code: 'not-a-number' })).toBe('default');
      expect(getCode(null)).toBe('default');
    });
  });

  describe('predefined getters', () => {
    it('should retrieve message, statusCode and code correctly', () => {
      expect(errorMessage()({ message: 'Error occurred' })).toBe('Error occurred');
      expect(errorMessage()({ message: 123 })).toBe(undefined);
      expect(errorMessage('fallback')({ message: 123 })).toBe('fallback');

      expect(errorStatusCode()({ statusCode: 404 })).toBe(404);
      expect(errorStatusCode(500)({})).toBe(500);

      expect(errorCode()({ code: 1 })).toBe(1);
    });
  });

  describe('safeMetadataGrpcGetter', () => {
    it('should retrieve grpc metadata field values correctly', () => {
      const metadata = {
        get: (key: string) => (key === 'auth' ? ['bearer token'] : undefined),
      };
      const getMeta = safeMetadataGrpcGetter(metadata);

      expect(getMeta('auth')).toEqual(['bearer token']);
      expect(getMeta('missing', 'fallback')).toBe('fallback');
    });

    it('should support internalRepr repr representation', () => {
      const metadata = {
        internalRepr: {
          get: (key: string) => (key === 'user-id' ? '123' : undefined),
        },
      };
      const getMeta = safeMetadataGrpcGetter(metadata);
      expect(getMeta('user-id')).toEqual(['123']);
    });
  });
});
