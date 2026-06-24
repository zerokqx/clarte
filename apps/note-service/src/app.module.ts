import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  AppConfigModule,
  CompactConfigModule,
  S3SharedModule,
} from '@clarte/shared-nest/modules';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNoteHandler } from './application/commands/create-note';
import { SaveNoteBytesHandler } from './application/commands/save-note-bytes';
import { GetBytesHandler, GetNoteByIdHandler } from './application/queries';
import { NotesController } from './presentation';
import { DatabaseModule } from './infrastructure/database';
import { MongooseModule } from '@nestjs/mongoose';

const handlers: Provider[] = [
  CreateNoteHandler,
  SaveNoteBytesHandler,
  GetNoteByIdHandler,
  GetBytesHandler,
];

interface MongoConfiguration {
  host: string;
  port: string;
  db: string;
  user: string;
  password: string;
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    CompactConfigModule.register<MongoConfiguration, string>({
      registerAsName: 'mongo-config',
      prefixOptions: { upperCase: true, value: 'mongo_' },
      fields:
        ({ env, prefix }) =>
        () => ({
          host: env.get(prefix('host'), 'localhost'),
          port: env.get(prefix('port'), '6001'),
          db: env.require(prefix('db')),
          user: env.require(prefix('user')),
          password: env.require(prefix('password')),
        }),
    }),
    MongooseModule.forRootAsync({
      useFactory(config: ConfigService) {
        const { user, password, host, db, port } =
          config.getOrThrow<MongoConfiguration>('mongo-config');
        const uri = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`;
        return { uri };
      },
      inject: [ConfigService],
    }),
    AppConfigModule,
    CqrsModule,
    S3SharedModule,
    DatabaseModule,
  ],
  controllers: [NotesController],
  providers: [...handlers],
})
export class AppModule {}
