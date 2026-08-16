import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { proto } from '@clarte/shared/functions';
import { join } from 'path';
import { NotificationController } from '@/app/notification/presentation/notification.controller';
import { NotificationClient } from '@/app/notification/infrastructure/clients/notification.client';
import { NOTIFICATION_CLIENT, NOTIFICATION_GRPC_CLIENT } from '@/app/notification/application';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';

import { PROTO_PATH } from '@/app/ports/di-tokens';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'notification-service',
      prefixOptions: { value: 'notification_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('notification-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Notification.NOTIFICATION_PACKAGE_NAME,
              protoPath: join(protoPath, proto('notification')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_CLIENT,
      useClass: NotificationClient,
    },
  ],
})
export class NotificationModule {}
