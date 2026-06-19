import { S3Module } from 'nestjs-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_STORAGE } from '@/application';
import { S3Storage } from './s3.storage';
import { CompactConfigModule } from '@clarte/shared-nest/modules';

interface S3Configuration {
  accessKey: string;
  endpoint: string;
  region: string;
  secretAccessKey: string;
}

@Global()
@Module({
  imports: [
    CompactConfigModule.register<S3Configuration, string>({
      registerAsName: 's3-config',
      prefixOptions: { value: 's3_', upperCase: true },
      fields:
        ({ env, prefix }) =>
        () => ({
          endpoint: env.require(prefix('endpoint')),
          bucket: env.require(prefix('bucket')),
          accessKey: env.require(prefix('access_key')),
          secretAccessKey: env.require(prefix('secret_access_key')),
          accountId: env.require(prefix('account_id')),
          region: env.get(prefix('region'), 'ru-central1'),
        }),
    }),
    S3Module.forRootAsync({
      useFactory(config: ConfigService) {
        const { accessKey, endpoint, region, secretAccessKey } =
          config.getOrThrow<S3Configuration>('s3-config');
        return {
          config: {
            endpoint,
            region,
            credentials: { secretAccessKey, accessKeyId: accessKey },
            forcePathStyle: true,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: S3_STORAGE,
      useClass: S3Storage,
    },
  ],
  exports: [S3_STORAGE],
})
export class S3ModuleLocal {}
