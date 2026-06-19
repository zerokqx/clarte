import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationOrmEntity } from './entites';
import {
  DatabaseConfig,
  DatabaseConfiguration,
  AppConfiguration,
} from '@clarte/shared-nest/modules';
import { NOTIFICATION_REPO } from '@/application/ports';
import { DatabaseNotificationRepository } from './database-notification.repository';

@Module({
  imports: [
    DatabaseConfig,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { host, port, user, dbName, password } =
          config.getOrThrow<DatabaseConfiguration>('database');
        const { isDev } = config.getOrThrow<AppConfiguration>('app-config');
        return {
          type: 'postgres',
          host,
          port: parseInt(port, 10),
          username: user,
          database: dbName,
          password,
          entities: [NotificationOrmEntity],
          synchronize: isDev,
        };
      },
    }),
    TypeOrmModule.forFeature([NotificationOrmEntity]),
  ],
  providers: [
    {
      provide: NOTIFICATION_REPO,
      useClass: DatabaseNotificationRepository,
    },
  ],
  exports: [NOTIFICATION_REPO],
})
export class DatabaseModule {}
