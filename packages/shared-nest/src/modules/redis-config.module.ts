import { prefixForEnv } from '@/functions';
import { Env } from '@humanwhocodes/env';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

const redisConfiguration = registerAs('redis', () => {
  const env = new Env();
  const redis = prefixForEnv('redis_', { upperCase: true });
  return {
    host: env.require(redis('host')),
    port: env.require(redis('port')),
    password: env.require(redis('password')),
  };
});

/**
 * @description Базовый модуль конфигурации для интеграции с Redis переменными
 */
@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfiguration)],
  exports: [ConfigModule],
})
export class RedisConfig {}

export type RedisConfiguration = ReturnType<typeof redisConfiguration>;
