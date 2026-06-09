/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Env } from '@humanwhocodes/env';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Contracts, Fn } from '@clarte/shared';
import { join } from 'path';

async function bootstrap() {
  const env = new Env();
  const PORT = env.get('PORT', 5001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: Contracts.Proto.User.USER_PACKAGE_NAME,
        url: `127.0.0.1:${PORT}`,
        protoPath: join(
          process.cwd(),
          Fn.getProtoPath('user'),
          // 'libs/shared/src/contracts/user/user.proto',
        ),
      },
    },
  );
  await app.listen();
}

bootstrap();
