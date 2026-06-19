import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/app/user/infrastructure/users.module';
import { AuthModule } from '@/app/auth/auth.module';
import { TodoModule } from '@/app/todo/todo.module';
import { NotificationModule } from '@/app/notification/infrastructure/notifications.module';
import { AppConfigModule, JwtModule } from '@clarte/shared-nest/modules';
import { JwtKeyProvider } from '@/app/auth/infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    AppConfigModule,
    UserModule,
    AuthModule,
    TodoModule,
    NotificationModule,
    JwtModule.register({
      imports: [AuthModule],
      provider: JwtKeyProvider,
    }),


  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
