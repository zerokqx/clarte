import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/database/user.entity';
import { UserRepository } from '../infrastructure/database/user.repository';
import { PASSWORD_HASHER_TOKEN } from '../domain/contracts/password-hasher.interface';
import { Argon2HasherService } from '../infrastructure/crypto/argon2-hasher.service';
import { FindUserByIdHandler } from '../application/queries/find-by-id/find-user-by-id.handler';
import { FindUserByLoginHandler } from '../application/queries/find-by-login/find-user-by-login.handler';
import { USER_REPOSITORY } from '../application/contracts/di-tokens';
import { GetCredentialsByIdHandelr } from '../application/queries/get-credentials-by-id/get-credentials-by-id.handler';
import { UserFindRpcController } from '../presentation/user-find.rpc.controller';
import { UserCredentialsController } from '../presentation/user-credentials.rpc.controller';

@Module({
  controllers: [UserFindRpcController, UserCredentialsController],
  providers: [
    FindUserByIdHandler,
    FindUserByLoginHandler,
    GetCredentialsByIdHandelr,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: Argon2HasherService,
    },
  ],
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
})
export class UserModule {}
