import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

const env = new Env();

export const databaseConfiguration = registerAs('database', () => ({
  dbName: env.require('POSTGRES_DB'),
  user: env.require('POSTGRES_USER'),
  password: env.require('POSTGRES_PASSWORD'),
  port: env.require('POSTGRES_PORT'),
  host: env.require('POSTGRES_HOST'),
}));

export type DatabaseConfiguration = ReturnType<typeof databaseConfiguration>;
