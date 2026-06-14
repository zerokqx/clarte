import { Module } from '@nestjs/common';
import { USER_CLIENT } from '../../application';
import { UserClient } from './user.client';
import { Contracts, Fn } from '@clarte/shared-contracts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_GRPC_CLIENT } from '../ports';
import { UserConfiguration, userConfiguration } from './user.configuration';

@Module({
  imports: [
    ConfigModule.forFeature(userConfiguration),
    ClientsModule.registerAsync([
      {
        name: USER_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } =
            config.getOrThrow<UserConfiguration>('user-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Contracts.Proto.User.USER_PACKAGE_NAME,
              protoPath: Fn.getProtoPath('user'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: USER_CLIENT,
      useClass: UserClient,
    },
  ],
  exports: [USER_CLIENT],
})
export class UserModule {}
