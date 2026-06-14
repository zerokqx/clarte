import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfiguration, authConfiguration } from './auth.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Contracts, Fn } from '@clarte/shared-contracts';
import { Guard, Modules } from '@clarte/shared-nest';
import { AUTH_CLIENT, AUTH_GRPC_CLIENT } from './aplication';
import { AuthClient } from './infrastructure/clients';
import { AuthController } from './presentation/auth.controller';
import { JwtKeyProvider } from './infrastructure';

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
  ],
  exports:[AUTH_CLIENT]
})
export class AuthModule {}
