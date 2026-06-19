import { Env } from '@humanwhocodes/env';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

const env = new Env();

const databaseConfiguration = registerAs('database', () => ({
  dbName: env.require('POSTGRES_DB'),
  user: env.require('POSTGRES_USER'),
  password: env.require('POSTGRES_PASSWORD'),
  port: env.require('POSTGRES_PORT'),
  host: env.require('POSTGRES_HOST'),
}));

/**
 * @description Базовый модуль конфигурации для интеграции с database переменными
 * @link databaseConfiguraton
 */
@Global()
@Module({
  imports: [ConfigModule.forFeature(databaseConfiguration)],
  exports: [ConfigModule],
})
export class DatabaseConfig {}

export type DatabaseConfiguration = ReturnType<typeof databaseConfiguration>;
