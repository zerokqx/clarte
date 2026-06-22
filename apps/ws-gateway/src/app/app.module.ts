import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HocusPocusService } from './hocuspocus.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HocusPocusService],
})
export class AppModule {}
