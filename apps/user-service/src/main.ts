/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Env } from '@humanwhocodes/env';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { User } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { ProblemDetailsToGrpcExceptionFilter } from '@clarte/shared-nest/filters';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5001);
  const HOST = env.get('HOST', 5001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: User.USER_PACKAGE_NAME,
        url: `${HOST}:${PORT}`,
        protoPath: join(process.cwd(), getProtoPath('user')),
      },
    },
  );
  app.useGlobalFilters(new ProblemDetailsToGrpcExceptionFilter());
  await app.listen();
  Logger.log(`👨‍🦱 User microservice started on url http://${HOST}:${PORT}`);
  Logger.log(`Protocol: gRPC`);
}

bootstrap();
