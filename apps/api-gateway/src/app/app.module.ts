import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/infrastructure/users.module';
import { AuthModule } from './auth/auth.module';
import { Modules } from '@clarte/shared-nest';
import { JwtKeyProvider } from './auth/infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'], isGlobal: true }),
    UserModule,
    AuthModule,
    Modules.JwtModule.register({
      imports: [AuthModule],
      provider: JwtKeyProvider,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
