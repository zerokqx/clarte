import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/infrastructure/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    UserModule,
    DatabaseModule,
  ],
})
export class AppModule {}
