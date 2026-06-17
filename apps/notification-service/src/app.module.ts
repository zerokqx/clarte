import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database';
import { NotificationRpcController } from './presentation';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationRpcController],
  providers: [],
})
export class AppModule {}
