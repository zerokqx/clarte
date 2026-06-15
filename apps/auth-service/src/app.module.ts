import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule, Argon2PasswordHasher, JwtModule } from '@/infrastructure';
import {
  LoginPasswordHandler,
  PASSWORD_HASHER,
  RegisterPasswordHandler,
  ValidateUserHandler,
  GetPublicJwtKeyHandler,
} from '@/application';
import { AuthController } from '@/presentation';
import { RefreshHandler } from './application/commands/refresh/refresh.handler';

const handlers: Provider[] = [
  LoginPasswordHandler,
  RegisterPasswordHandler,
  ValidateUserHandler,
  GetPublicJwtKeyHandler,
  RefreshHandler,
];

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
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
