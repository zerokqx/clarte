import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HocuspocusModule } from './hocuspocus/infrastructure/hocuspocus.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/infrastructure';
import { NoteModule } from './note/infrastructure';
import { JwtService } from '@nestjs/jwt';
import { NOTE_CLIENT } from './note';

import { type INoteClient } from './note';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NoteModule,
    HocuspocusModule.registerAsync({
      imports: [AuthModule, NoteModule],
      useFactory(jwtService: JwtService, noteService: INoteClient) {
        return {
          noteClient: noteService,
          jwtValidator: {
            async validate(token) {
              return jwtService.verifyAsync(token);
            },
          },
        };
      },
      inject: [JwtService, NOTE_CLIENT],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
