import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from '@clarte/shared-contracts/proto';
import { proto } from '@clarte/shared/functions';
import { join } from 'path';
import { UserController } from '@/app/user/presentation/user.controller';
import { UserStorageController } from '@/app/user/presentation/user-storage.controller';
import { UserEditController } from '@/app/user/presentation/user-edit.controller';
import { UserClient } from '@/app/user/infrastructure/clients/user.client';
import { USER_CLIENT, USER_GRPC_CLIENT } from '@/app/user/application';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';

import { PROTO_PATH } from '@/app/ports/di-tokens';

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
              url: `${host}:${port}`,
              package: User.USER_PACKAGE_NAME,
              protoPath: join(protoPath, proto('user')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
  ],
  controllers: [UserController, UserStorageController, UserEditController],
  providers: [
    {
      provide: USER_CLIENT,
      useClass: UserClient,
    },
  ],
})
export class UserModule {}
