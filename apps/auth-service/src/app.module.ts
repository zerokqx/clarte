import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UserModule,
  Argon2PasswordHasher,
  JwtModule,
  DatabaseModule,
  PROTO_PATH,
} from '@/infrastructure';
import {
  LoginPasswordHandler,
  PASSWORD_HASHER,
  RegisterPasswordHandler,
  ValidateUserHandler,
  GetPublicJwtKeyHandler,
  AUTH_RMQ_CLIENT,
  ASSETS_PATH,
} from '@/application';
import { AuthController } from '@/presentation';
import { RefreshHandler } from './application/commands/refresh/refresh.handler';
import { AppConfigModule } from '@clarte/shared-nest/config';
import { RmqModule } from '@clarte/shared-nest/infra';
import { exchange, env } from '@clarte/shared';
import { createFolderPathModule } from '@clarte/shared-nest/infra';

const handlers: Provider[] = [
  LoginPasswordHandler,
  RegisterPasswordHandler,
  ValidateUserHandler,
  GetPublicJwtKeyHandler,
  RefreshHandler,
];

@Module({
  imports: [
    createFolderPathModule({ name: PROTO_PATH, folderName: 'proto', from: __dirname }),
    createFolderPathModule({ name: ASSETS_PATH, folderName: 'assets', from: __dirname }),

    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [env('local'), env()],
    }),
    AppConfigModule,
    DatabaseModule,
    RmqModule.register({
      name: AUTH_RMQ_CLIENT,
      options: {
        exchange: exchange('auth', 'events'),
        exchangeType: 'topic',
        wildcards: true,
        queueOptions: { durable: true },
      },
    }),
    UserModule,
    JwtModule,
  ],
  providers: [
    ...handlers,
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
  ],
  controllers: [AuthController],
})
export class AppModule {}
