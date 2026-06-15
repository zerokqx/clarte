/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Env } from '@humanwhocodes/env';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Contracts, Fn } from '@clarte/shared-contracts';
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
        package: Contracts.Proto.User.USER_PACKAGE_NAME,
        url: `${HOST}:${PORT}`,
        protoPath: join(process.cwd(), Fn.getProtoPath('user')),
      },
    },
  );
  app.useGlobalFilters(new ProblemDetailsToGrpcExceptionFilter());
  await app.listen();
  Logger.log(`👨‍🦱 User microservice started on url http://${HOST}:${PORT}`);
  Logger.log(`Protocol: gRPC`);
}

bootstrap();
