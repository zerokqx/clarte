import { JwtModule as JwtModuleNestJS } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtService } from '@/infrastructure/jwt/jwt.service';
import { ASSETS_PATH, JWT_SERVICE } from '@/application';
import { sslKey } from '@clarte/shared';

@Module({
  imports: [
    JwtModuleNestJS.registerAsync({
      async useFactory(assetsPath: string) {
        const read = (file: string) => readFileSync(join(assetsPath, file), 'utf-8');

        const privateKey = read(sslKey('private'));
        const publicKey = read(sslKey('public'));
        return {
          signOptions: { algorithm: 'RS256' },
          global: true,
          privateKey,
          publicKey,
        };
      },
      inject:[ASSETS_PATH]
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
