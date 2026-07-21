import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure';
import { NotificationRpcController } from './presentation';
import { AppConfigModule } from '@clarte/shared-nest/modules';
import { GetNotificationsHandler } from './application/queries/get-notifications';
import { CreateNotifyHandler } from './application/commands/create-notify';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [NotificationRpcController],
  providers: [GetNotificationsHandler, CreateNotifyHandler],
})
export class AppModule {}

