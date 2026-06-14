import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserConfiguration, userConfiguration } from './user.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Contracts, Fn } from '@clarte/shared-contracts';
import { UserController } from '../presentation/user.controller';
import { UserClient } from './clients/user.client';
import { USER_CLIENT, USER_GRPC_CLIENT } from '../application';

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
  controllers: [UserController],
  providers: [
    {
      provide: USER_CLIENT,
      useClass: UserClient,
    },
  ],
})
export class UserModule {}
