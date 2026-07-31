/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Env } from '@humanwhocodes/env';
import { Notes } from '@clarte/shared-contracts/proto';
import { join } from 'path';
import { findUp, nullThrow, proto } from '@clarte/shared';

async function bootstrap() {
  const env = new Env();
  const HOST = env.get('HOST', 'localhost');
  const PORT = env.get('PORT', 5003);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${HOST}:${PORT}`,
      protoPath: join(nullThrow(findUp)('proto', __dirname), proto('notes')),
      package: Notes.NOTES_PACKAGE_NAME,
    },
  });
  await app.listen();
  Logger.log(`📝 Notes microservice is running on: http://${HOST}:${PORT}`);
}

bootstrap();
