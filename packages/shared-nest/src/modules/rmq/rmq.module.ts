import { type Token } from '@clarte/shared';
import type { OmitDeep } from 'type-fest';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqConfiguration, rmqConfiguration } from './rmq.config';

type RmqModuleOptions = OmitDeep<RmqOptions, 'transport' | 'options.urls'> & {
  name: Token;
};

@Module({
  imports: [ConfigModule.forFeature(rmqConfiguration)],
})
export class RmqModule {
  public static register({ name, options }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory(config: ConfigService) {
              const { defaultUser, defaultPass, host, port } =
                config.getOrThrow<RmqConfiguration>('rmq-config');
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`amqp://${defaultUser}:${defaultPass}@${host}:${port}`],
                  ...options,
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
