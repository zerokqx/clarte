import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Env } from '@humanwhocodes/env';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { Notification } from '@clarte/shared-contracts/proto';

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
      protoPath: getProtoPath('notification'),
    },
  });

  // Connect RMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: 'notification_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start all microservices (both gRPC and RMQ listeners)
  await app.startAllMicroservices();

  // Wires up the Nest application context without starting an HTTP server
  await app.init();

  Logger.log(
    `🚀 Notification Service is listening on gRPC: grpc://${HOST}:${PORT}`,
  );
  Logger.log(
    `🚀 Notification Service is listening on RMQ: ${rmqUrl} (queue: notification_queue)`,
  );
}

bootstrap();
