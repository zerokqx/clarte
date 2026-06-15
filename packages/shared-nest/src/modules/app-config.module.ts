import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app-config', () => {
  const env = new Env();
  return {
    isDev: env.get('NODE_ENV', 'development') === 'development',
    isProd: env.get('NODE_ENV', 'production') === 'production',
  };
});

/**
 * @description Базовый модуль конфигурации для всех приложений
 */
@Global()
@Module({
  imports: [ConfigModule.forFeature(appConfiguration)],
  exports: [ConfigModule],
})
export class AppConfigModule {}

export type AppConfiguration = ReturnType<typeof appConfiguration>;
