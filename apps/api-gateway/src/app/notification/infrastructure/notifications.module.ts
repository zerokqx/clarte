import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationConfiguration, notificationConfiguration } from '@/app/notification/infrastructure/notification.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { NotificationController } from '@/app/notification/presentation/notification.controller';
import { NotificationClient } from '@/app/notification/infrastructure/clients/notification.client';
import { NOTIFICATION_CLIENT, NOTIFICATION_GRPC_CLIENT } from '@/app/notification/application';

@Module({
  imports: [
    ConfigModule.forFeature(notificationConfiguration),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } =
            config.getOrThrow<NotificationConfiguration>('notification-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Notification.NOTIFICATION_PACKAGE_NAME,
              protoPath: getProtoPath('notification'),
            },
          };
        },
        inject: [ConfigService],
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
