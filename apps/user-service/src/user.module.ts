import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_AVATAR_GENERATOR,
  USER_READ_REPOSITORY,
  USER_WRITE_REPOSITORY,
} from '@/application';
import {
  UserCredentialsController,
  UserFindRpcController,
  UserCreateController,
} from '@/presentation';
import {
  FindUserByIdHandler,
  FindUserByLoginHandler,
  GetCredentialsByIdHandelr,
} from '@/application';
import { UserCreateHandler } from '@/application';
import {
  UserAvatarGenerator,
  UserOrmEntity,
  UserReadRepository,
  UserWriteRepository,
} from '@/infrastructure';

@Module({
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
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
})
export class UserModule {}
