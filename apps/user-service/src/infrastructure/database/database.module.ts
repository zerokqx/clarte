import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseConfiguration,
  databaseConfiguration,
} from './database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../../modules/users/infrastructure/database/user.entity';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfiguration),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const { host, port, user, dbName, password } =
          config.getOrThrow<DatabaseConfiguration>('database');
        return {
          type: 'postgres',
          host,
          port: parseInt(port, 10),
          username: user,
          database: dbName,
          password,
          entities: [UserOrmEntity],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
