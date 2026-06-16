import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/database/user.entity';

import {
  AppConfiguration,
  DatabaseConfig,
  DatabaseConfiguration,
} from '@clarte/shared-nest/modules';
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
          entities: [UserOrmEntity],
          synchronize: isDev,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
