import { JwtModule as JwtModuleNestJS } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtService } from '@/infrastructure/jwt/jwt.service';
import { JWT_SERVICE } from '@/application';
import { p, sslKey } from '@clarte/shared';

@Module({
  imports: [
    JwtModuleNestJS.registerAsync({
      async useFactory() {
        const read = (file: string) => readFileSync(join(__dirname, p(2), 'assets', file), 'utf-8');

        const privateKey = read(sslKey('private'));
        const publicKey = read(sslKey('public'));
        return {
          signOptions: { algorithm: 'RS256' },
          global: true,
          privateKey,
          publicKey,
        };
      },
    }),
  ],
  providers: [
    {
      provide: JWT_SERVICE,
      useClass: JwtService,
    },
  ],
  exports: [JWT_SERVICE],
})
export class JwtModule {}
