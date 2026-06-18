import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { UserController } from '@/app/user/presentation/user.controller';
import { UserClient } from '@/app/user/infrastructure/clients/user.client';
import { USER_CLIENT, USER_GRPC_CLIENT } from '@/app/user/application';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/modules';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'user-service',
      prefixOptions: { value: 'user_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: USER_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } =
            config.getOrThrow<MicroserviceConfigType>('user-service');
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
  controllers: [UserController],
  providers: [
    {
      provide: USER_CLIENT,
      useClass: UserClient,
    },
  ],
})
export class UserModule {}
