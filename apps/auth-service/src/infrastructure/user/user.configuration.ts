
import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

const env = new Env();

export const userConfiguration = registerAs('user-service', () => ({
  port: env.require('USER_PORT'),
  host: env.get('USER_HOST', 'localhost'),
}));

export type UserConfiguration = ReturnType<typeof userConfiguration>;
