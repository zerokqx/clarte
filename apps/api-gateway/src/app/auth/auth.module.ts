import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfiguration, authConfiguration } from '@/app/auth/auth.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Contracts, Fn } from '@clarte/shared-contracts';
import { Guard, Modules, Interceptors, COOKIE_INTERCEPTOR_OPTIONS } from '@clarte/shared-nest';
import { AUTH_CLIENT, AUTH_GRPC_CLIENT } from '@/app/auth/aplication';
import { AuthClient } from '@/app/auth/infrastructure/clients';
import { AuthController } from '@/app/auth/presentation/auth.controller';
import { JwtKeyProvider } from '@/app/auth/infrastructure';
import { AppConfiguration } from '@/app/app.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfiguration),
    ClientsModule.registerAsync([
      {
        name: AUTH_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } =
            config.getOrThrow<AuthConfiguration>('auth-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Contracts.Proto.Auth.AUTH_PACKAGE_NAME,
              protoPath: Fn.getProtoPath('auth'),
            },
          };
        },
        inject: [ConfigService],
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
        const isProd =
          config.getOrThrow<AppConfiguration>('app-config').isProd;
        return {
          isProd,
        };
      },
      inject: [ConfigService],
    },
  ],
  exports:[AUTH_CLIENT]
})
export class AuthModule {}
