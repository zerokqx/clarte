/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Contracts, Fn } from '@clarte/shared-contracts';
import { Filters } from '@clarte/shared-nest/filters';
import { Interceptors } from '@clarte/shared-nest/interceptors';
import { Env } from '@humanwhocodes/env';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5003);
  const HOST = env.get('HOST', 'localhost');


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: Contracts.Proto.Auth.AUTH_PACKAGE_NAME,
        url: `${HOST}:${PORT}`,
        protoPath: Fn.getProtoPath('auth'),
      },
    },
  );
  app.useGlobalFilters(new Filters.ProblemDetailsToGrpcExceptionFilter());
  app.useGlobalInterceptors(new Interceptors.GrpcErrorPropagationInterceptor());
  await app.listen();
  Logger.log(`🛂 Auth microservice started on url http://${HOST}:${PORT}`);
  Logger.log("Protocol: gRPC")

}

bootstrap().catch((err) => {
  console.error('💥 Fatal error during bootstrap of Auth microservice:', err);
});
