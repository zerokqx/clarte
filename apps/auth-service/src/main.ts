/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Auth } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { ProblemDetailsToGrpcExceptionFilter } from '@clarte/shared-nest/filters';
import { GrpcErrorPropagationInterceptor } from '@clarte/shared-nest/interceptors';
import { Env } from '@humanwhocodes/env';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5002);
  const HOST = env.get('HOST', 'localhost');


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: Auth.AUTH_PACKAGE_NAME,
        url: `${HOST}:${PORT}`,
        protoPath: getProtoPath('auth'),
      },
    },
  );
  app.useGlobalFilters(new ProblemDetailsToGrpcExceptionFilter());
  app.useGlobalInterceptors(new GrpcErrorPropagationInterceptor());
  await app.listen();
  Logger.log(`🛂 Auth microservice started on url http://${HOST}:${PORT}`);
  Logger.log("Protocol: gRPC")

}

bootstrap().catch((err) => {
  console.error('💥 Fatal error during bootstrap of Auth microservice:', err);
});
