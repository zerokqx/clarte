/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Env } from '@humanwhocodes/env';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { HOCUSPOCUS_SERVER, type IHocuspocusServerPort } from './app/hocuspocus/application/ports';

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

  const hocuspocusServer = app.get<IHocuspocusServerPort>(HOCUSPOCUS_SERVER);
  const httpServer = app.getHttpServer();
  httpServer.on('upgrade', (request: any, socket: any, head: any) => {
    const pathname = request.url;
    Logger.log(`[HTTP Upgrade] Request to ${pathname}`);
    if (pathname?.startsWith('/yjs')) {
      Logger.log(`[HTTP Upgrade] Handled by crossws. Passing to Hocuspocus...`);
      hocuspocusServer.handleUpgrade(request, socket, head);
    }
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
  Logger.log(`🚀 WS Gateway HTTP/Socket.io is running on port: ${PORT}`);
  Logger.log(`🔗 Hocuspocus (Yjs) is available at ws://localhost:${PORT}/yjs`);
  Logger.log(`🚀 WS Gateway RMQ Listener attached to queue: ws_gateway_queue`);
}

bootstrap();
