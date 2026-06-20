import { prefixForEnv } from '@clarte/shared';
import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

export const rmqConfiguration = registerAs('rmq-config', () => {
  const env = new Env();
  const rmq = prefixForEnv('rmq_', { upperCase: true });
  return {
    defaultUser: env.require(rmq('default_user')),
    defaultPass: env.require(rmq('default_pass')),
    host: env.get(rmq('host'), 'localhost'),
    port: env.get(rmq('port'), 7001),
  };
});

export type RmqConfiguration = ReturnType<typeof rmqConfiguration>;
