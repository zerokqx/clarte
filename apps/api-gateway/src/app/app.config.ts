import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';
export const appConfiguration = registerAs('app-config', () => {
  const env = new Env();
  return {
    isDev: env.get('NODE_ENV', 'development') === 'development',
    isProd: env.get('NODE_ENV', 'production') === 'production',
  };
});

export type AppConfiguration = ReturnType<typeof appConfiguration>;
