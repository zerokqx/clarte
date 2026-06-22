/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Env } from '@humanwhocodes/env';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5006);

  const rmqUser = env.require('RMQ_DEFAULT_USER');
  const rmqPass = env.require('RMQ_DEFAULT_PASS');
  const rmqHost = env.get('RMQ_HOST', 'localhost');
  const rmqPort = env.get('RMQ_PORT', 7001);
  const rmqUrl = `amqp://${rmqUser}:${rmqPass}@${rmqHost}:${rmqPort}`;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      exchange: 'clarte_events_exchange',
      wildcards: true,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(PORT);
  Logger.log(`🚀 WS Gateway HTTP/Socket.io is running on port: ${PORT}`);
  Logger.log(`🚀 WS Gateway RMQ Listener attached to queue: ws_gateway_queue`);
}

bootstrap();
