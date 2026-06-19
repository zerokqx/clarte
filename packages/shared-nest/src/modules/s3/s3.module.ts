import { S3Module } from 'nestjs-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompactConfigModule } from '../compact-config/compact-config.module';
import { S3ConfigurationType } from './s3.config';
import { S3_SERVICE_TOKEN } from './ports';
import { S3Service } from './s3.service';

/**
 * S3SharedModule — глобальный модуль для интеграции с S3/MinIO хранилищем.
 *
 * Предоставляет два основных способа работы в микросервисах:
 *
 * 1. Готовый обернутый сервис (IS3Service) с настроенными Effect-методами.
 *    Методы возвращают Effect.Effect напрямую, что позволяет использовать их в генераторах через yield*
 *    без ручного оборачивания в Effect.tryPromise:
 *    ```typescript
 *    constructor(@InjectS3Service() private readonly s3Service: IS3Service) {}
 *
 *    // Пример вызова в Effect.gen:
 *    yield* _(this.s3Service.upload(bucket, key, file, mimeType));
 *    ```
 *
 * 2. Сырой S3-клиент (nestjs-s3) из библиотеки — для прямого низкоуровневого доступа к AWS S3 SDK:
 *    ```typescript
 *    constructor(@InjectS3() private readonly s3Client: S3) {}
 *    ```
 */
@Global()
@Module({
  imports: [
    CompactConfigModule.register<S3ConfigurationType, string>({
      registerAsName: 's3-config',
      prefixOptions: { value: 'S3_', upperCase: true },
      fields:
        ({ env, prefix }) =>
        () => ({
          endpoint: env.require(prefix('ENDPOINT')),
          bucket: env.require(prefix('BUCKET')),
          accessKey: env.require(prefix('ACCESS_KEY')),
          secretAccessKey: env.require(prefix('SECRET_ACCESS_KEY')),
          accountId: env.require(prefix('ACCOUNT_ID')),
          region: env.get(prefix('REGION'), 'ru-central1'),
        }),
    }),
    S3Module.forRootAsync({
      useFactory(config: ConfigService) {
        const { accessKey, endpoint, region, secretAccessKey } =
          config.getOrThrow<S3ConfigurationType>('s3-config');
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
      provide: S3_SERVICE_TOKEN,
      useClass: S3Service,
    },
  ],
  exports: [S3_SERVICE_TOKEN],
})
export class S3SharedModule {}
