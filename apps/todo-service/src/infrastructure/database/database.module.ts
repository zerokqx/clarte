import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoOrmEntity } from '@/infrastructure/database/entites/todo.entity';

import {
  AppConfiguration,
  DatabaseConfig,
  DatabaseConfiguration,
} from '@clarte/shared-nest/modules';
import { TODO_REPO_READ, TODO_REPO_WRITE } from '@/application';
import { TodoRepositoryRead } from './database-read.repository';
import { TodoWriteRepository } from './database-write.repository';

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
          entities: [TodoOrmEntity],
          synchronize: isDev,
        };
      },
    }),
    TypeOrmModule.forFeature([TodoOrmEntity]),
  ],
  providers: [
    {
      provide: TODO_REPO_READ,
      useClass: TodoRepositoryRead,
    },
    {
      provide: TODO_REPO_WRITE,
      useClass: TodoWriteRepository,
    },
  ],
  exports: [TODO_REPO_WRITE, TODO_REPO_READ],
})
export class DatabaseModule {}
