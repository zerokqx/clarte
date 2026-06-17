import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database';
import { NotificationRpcController } from './presentation';
import { AppConfigModule } from '@clarte/shared-nest/modules';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [NotificationRpcController],
  providers: [],
})
export class AppModule {}
