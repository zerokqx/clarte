import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Auth } from '@clarte/shared-contracts/proto';
import { hostPort, proto } from '@clarte/shared/functions';
import { join } from 'path';
import { COOKIE_INTERCEPTOR_OPTIONS } from '@clarte/shared-nest/core/ports';
import { AUTH_CLIENT, AUTH_GRPC_CLIENT } from '@/app/auth/aplication';
import { AuthClient } from '@/app/auth/infrastructure/clients';
import { AuthController } from '@/app/auth/presentation/auth.controller';
import {
  AppConfiguration,
  MicroserviceConfigModule,
  MicroserviceConfigType,
} from '@clarte/shared-nest/config';

import { PROTO_PATH } from '@/app/ports/di-tokens';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'auth-service',
      prefixOptions: { value: 'auth_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('auth-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: hostPort(host, port),
              package: Auth.AUTH_PACKAGE_NAME,
              protoPath: join(protoPath, proto('auth')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_CLIENT,
      useClass: AuthClient,
    },
    {
      provide: COOKIE_INTERCEPTOR_OPTIONS,
      useFactory: (config: ConfigService) => {
        const isProd = config.getOrThrow<AppConfiguration>('app-config').isProd;
        return {
          isProd,
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: [AUTH_CLIENT],
})
export class AuthModule {}
