import { ClientsModule, Transport } from '@nestjs/microservices';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqConfiguration, rmqConfiguration } from './rmq.config';
import { AmqplibQueueOptions } from '@nestjs/microservices/external/rmq-url.interface';

interface RmqModuleOptions {
  name: string | symbol;
  queue?: string;
  queueOptions?: AmqplibQueueOptions;
  exchange?: string;
  exchangeType?: string;
}

@Module({
  imports: [ConfigModule.forFeature(rmqConfiguration)],
})
export class RmqModule {
  public static register({
    name,
    queue,
    queueOptions,
    exchange,
    exchangeType,
  }: RmqModuleOptions): DynamicModule {
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
                  queue: queue ?? '',
                  urls: [`amqp://${defaultUser}:${defaultPass}@${host}:${port}`],
                  queueOptions: queueOptions ?? {durable: true},
                  ...(exchange && { exchange, wildcards: true }),
                  ...(exchangeType && { exchangeType }),
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
