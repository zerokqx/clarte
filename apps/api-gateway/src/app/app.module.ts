import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/app/user/infrastructure/users.module';
import { AuthModule } from '@/app/auth/auth.module';
import { JwtModule } from '@clarte/shared-nest/modules';
import { JwtKeyProvider } from '@/app/auth/infrastructure';
import { appConfiguration } from '@/app/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      load: [appConfiguration],
    }),
    UserModule,
    AuthModule,
    JwtModule.register({
      imports: [AuthModule],
      provider: JwtKeyProvider,
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
