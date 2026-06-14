import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

export const authConfiguration = registerAs('auth-service', () => {
  const env = new Env();
  return {
    host: env.get('AUTH_HOST', 'localhost'),
    port: env.require('AUTH_PORT'),
  };
});

export type AuthConfiguration = ReturnType<typeof authConfiguration>;
