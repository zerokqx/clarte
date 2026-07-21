import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure';
import {
  NotificationRpcController,
  NotificationUserRpcController,
  NotificationTodoRpcController,
} from './presentation';
import { AppConfigModule } from '@clarte/shared-nest/modules';
import { GetNotificationsHandler } from './application/queries/get-notifications';
import { CreateNotifyHandler } from './application/commands/create-notify';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [AppConfigModule, DatabaseModule, CqrsModule.forRoot()],
  controllers: [
    NotificationRpcController,
    NotificationUserRpcController,
    NotificationTodoRpcController,
  ],
  providers: [GetNotificationsHandler, CreateNotifyHandler],
})
export class AppModule {}
