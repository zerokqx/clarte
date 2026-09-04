import { nullThrow, proto, queue, exchange } from '@clarte/shared';
import { findUp } from '@clarte/shared-nest/core/functions';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Env } from '@humanwhocodes/env';
import { join } from 'path';
import { Notification } from '@clarte/shared-contracts/proto';
import { GrpcExceptionFilter } from '@clarte/shared-nest/filters';
import { GrpcErrorPropagationInterceptor } from '@clarte/shared-nest/interceptors';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5005);
  const HOST = env.get('HOST', 'localhost');

  const rmqUser = env.require('RMQ_DEFAULT_USER');
  const rmqPass = env.require('RMQ_DEFAULT_PASS');
  const rmqHost = env.get('RMQ_HOST', 'localhost');
  const rmqPort = env.get('RMQ_PORT', 7001);
  const rmqUrl = `amqp://${rmqUser}:${rmqPass}@${rmqHost}:${rmqPort}`;

  // Create standard hybrid application
  const app = await NestFactory.create(AppModule);

  // Connect gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${HOST}:${PORT}`,
      package: Notification.NOTIFICATION_PACKAGE_NAME,
      protoPath: join(nullThrow(findUp)('proto', __dirname), proto('notification')),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: queue('notification-service'),
      exchange: exchange('user', 'events'),
      exchangeType: 'topic',
      wildcards: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalFilters(new GrpcExceptionFilter());
  app.useGlobalInterceptors(new GrpcErrorPropagationInterceptor());

  // Start all microservices (both gRPC and RMQ listeners)
  await app.startAllMicroservices();

  // Wires up the Nest application context without starting an HTTP server
  await app.init();

  Logger.log(`🚀 Notification Service is listening on gRPC: grpc://${HOST}:${PORT}`);
  Logger.log(`🚀 Notification Service is listening on RMQ: ${rmqUrl} (queue: notification_queue)`);
}

bootstrap();
