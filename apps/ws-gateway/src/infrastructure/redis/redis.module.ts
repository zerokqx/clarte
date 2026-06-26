import { CompactConfigModule } from '@clarte/shared-nest/modules';
import { Module } from '@nestjs/common';
import { IRedisConfiguration } from '../../application';

@Module({
  imports: [
    CompactConfigModule.register<IRedisConfiguration, string>({
      registerAsName: 'redis-config',
      prefixOptions: { upperCase: true, value: 'redis_' },
      fields:
        ({ env, prefix }) =>
        () => ({
          host: env.require(prefix('host')),
          port: parseInt(env.require(prefix('port')), 10),
          password: env.get(prefix('password')),
        }),
    }),
  ],
})
export class RedisModule {}
