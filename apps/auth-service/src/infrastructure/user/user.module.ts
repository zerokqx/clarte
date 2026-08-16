import { Module } from '@nestjs/common';
import { USER_CLIENT } from '@/application';
import { UserClient } from '@/infrastructure/user/user.client';
import { User } from '@clarte/shared-contracts/proto';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PATH, USER_GRPC_CLIENT } from '@/infrastructure/ports';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';
import { hostPort, proto } from '@clarte/shared';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'user-service',
      prefixOptions: { value: 'user_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: USER_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('user-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: hostPort(host, port),
              package: User.USER_PACKAGE_NAME,
              protoPath: join(protoPath, proto('user')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
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
