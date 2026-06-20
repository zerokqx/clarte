import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import {
  AppConfigModule,
  RedisConfig,
  RedisConfiguration,
  RmqModule,
} from '@clarte/shared-nest/modules';
import {
  TODO_BULLMQ_TIMERS,
  TODO_RMQ_CLIENT,
  TodoReminderService,
} from './application';
import { DatabaseModule, ReminderProcessor } from './infrastructure';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TodoRpcController } from './presentation';
import {
  CreateTodoHandler,
  UpdateTodoHandler,
  GetUserTodosHandler,
} from './application';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisConfig,
    CqrsModule.forRoot(),
    AppConfigModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    RmqModule.register({
      name: TODO_RMQ_CLIENT,
      exchange: 'clarte_events_exchange',
      exchangeType: 'topic',
    }),
    BullModule.forRootAsync({
      useFactory(config: ConfigService) {
        const { host, password, port } =
          config.getOrThrow<RedisConfiguration>('redis');
        return {
          connection: { password, host, port: parseInt(port, 10) },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: TODO_BULLMQ_TIMERS,
    }),
    DatabaseModule,
  ],
  controllers: [TodoRpcController],
  providers: [
    CreateTodoHandler,
    UpdateTodoHandler,
    GetUserTodosHandler,
    TodoReminderService,
    ReminderProcessor,
  ],
})
export class AppModule {}
