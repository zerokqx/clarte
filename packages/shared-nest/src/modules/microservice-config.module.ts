import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Env } from '@humanwhocodes/env';
import { ConfigModule, registerAs } from '@nestjs/config';
import { prefixForEnv, PrefixForEnvOption, Prefix } from '@/functions';

type ConfigPrefixer<P extends string, Opt extends PrefixForEnvOption> = <
  V extends string,
>(
  value: V,
) => Prefix<P, V, Opt>;

interface AdditionalFieldsArgs<
  P extends string,
  Opt extends PrefixForEnvOption,
> {
  prefix: ConfigPrefixer<P, Opt>;
  env: Env;
}

interface Options<
  T extends object,
  N extends string,
  P extends string,
  Opt extends PrefixForEnvOption,
  TDefault extends boolean = true,
> {
  registerAsName: N;
  defaultFields?: TDefault;
  prefixOptions: { value: P } & Opt;
  additionalFields?: (args: AdditionalFieldsArgs<P, Opt>) => T;
}

export interface MicroserviceConfigTypeDefaultFields {
  host: string;
  port: string;
}
export type MicroserviceConfigType<
  T extends object = object,
  TDefault extends boolean = true,
> = T & (TDefault extends true ? MicroserviceConfigTypeDefaultFields : object);

@Module({})
export class MicroserviceConfigModule {
  public static register<
    T extends object,
    N extends string,
    P extends string,
    Opt extends PrefixForEnvOption = object,
    TDefault extends boolean = true,
  >({
    registerAsName,
    additionalFields,
    defaultFields = true as TDefault,
    prefixOptions: { value, ...options },
  }: Options<T, N, P, Opt, TDefault>): DynamicModule {
    const logger = new Logger(MicroserviceConfigModule.name);

    logger.debug(`Инициализация модуля конфигурации для ${registerAsName}`);
    const configuration = registerAs(
      registerAsName,
      (): MicroserviceConfigType<T, TDefault> => {
        const env = new Env();
        const prefix = prefixForEnv(value, options);
        logger.debug(`Тестовый префикс - ${prefix('test')}`);
        const fields: MicroserviceConfigTypeDefaultFields = {
          host: env.get(prefix('host'), 'localhost'),
          port: env.require(prefix('port')),
        };

        logger.debug(
          `Дефолтные значений - ${defaultFields ? 'Включено' : 'Отключено'}`, fields
        );

        return {
          ...(defaultFields ? fields : {}),
          ...(additionalFields ? additionalFields({ prefix, env }) : {}),
        } as MicroserviceConfigType<T, TDefault>;
      },
    );
    logger.debug('RegisterAs успешно завершил работу');
    return {
      module: MicroserviceConfigModule,
      imports: [ConfigModule.forFeature(configuration)],
    };
  }
}
