/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Env } from '@humanwhocodes/env';
import { Todo } from '@clarte/shared-contracts/proto';

import { getProtoPath } from '@clarte/shared-contracts/functions';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5004);
  const HOST = env.get('HOST', 'localhost');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${HOST}:${PORT}`,
        package: Todo.TODO_PACKAGE_NAME,
        protoPath: getProtoPath('todo'),
      },
    },
  );
  await app.listen();
  Logger.log(`🚀 Microservice Todo is running on grpc://${HOST}:${PORT}`);
}
bootstrap();
