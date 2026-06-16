import { Module } from '@nestjs/common';
import { USER_CLIENT } from '@/application';
import { UserClient } from '@/infrastructure/user/user.client';
import { User } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_GRPC_CLIENT } from '@/infrastructure/ports';
import { UserConfiguration, userConfiguration } from '@/infrastructure/user/user.configuration';

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
              package: User.USER_PACKAGE_NAME,
              protoPath: getProtoPath('user'),
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
