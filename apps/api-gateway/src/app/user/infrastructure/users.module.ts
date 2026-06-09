import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserConfiguration, userConfiguration } from './user.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_CLIENT } from '../application/user.tokens';
import { Contracts, Fn } from '@clarte/shared';
import { UserFindService } from '../application/user.service';
import { UserController } from '../presentation/user.controller';

@Module({
  imports: [
    ConfigModule.forFeature(userConfiguration),
    ClientsModule.registerAsync([
      {
        name: USER_CLIENT,
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
  providers: [UserFindService],
})
export class UserModule {}
