import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

const env = new Env();
export const userConfiguration = registerAs('user-service', () => ({
  port: env.get('USER_PORT', 5001),
  host: env.get('USER_HOST', 'localhost'),
}));

export type UserConfiguration = ReturnType<typeof userConfiguration>;
