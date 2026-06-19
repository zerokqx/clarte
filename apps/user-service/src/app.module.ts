import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from '@clarte/shared-nest/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_AVATAR_GENERATOR,
  USER_READ_REPOSITORY,
  USER_WRITE_REPOSITORY,
  USER_RMQ_CLIENT,
  FindUserByIdHandler,
  FindUserByLoginHandler,
  GetCredentialsByIdHandelr,
  UserCreateHandler,
} from '@/application';
import {
  UserCredentialsController,
  UserFindRpcController,
  UserCreateController,
} from '@/presentation';
import {
  UserAvatarGenerator,
  UserOrmEntity,
  UserReadRepository,
  UserWriteRepository,
} from '@/infrastructure';
import { RmqModule } from '@clarte/shared-nest/modules';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    AppConfigModule,
    RmqModule.register({
      name: USER_RMQ_CLIENT,
      exchange: 'clarte_events_exchange',
      exchangeType: 'topic',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [
    UserFindRpcController,
    UserCredentialsController,
    UserCreateController,
  ],
  providers: [
    FindUserByIdHandler,
    FindUserByLoginHandler,
    GetCredentialsByIdHandelr,
    UserCreateHandler,
    {
      provide: USER_READ_REPOSITORY,
      useClass: UserReadRepository,
    },
    {
      provide: USER_WRITE_REPOSITORY,
      useClass: UserWriteRepository,
    },
    {
      provide: USER_AVATAR_GENERATOR,
      useClass: UserAvatarGenerator,
    },
  ],
})
export class AppModule {}
