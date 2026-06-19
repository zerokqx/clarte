import { prefixForEnv, PrefixForEnvOption } from '@clarte/shared';
import { Env } from '@humanwhocodes/env';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

const globalEnv = new Env();
type FieldsArgsFn<TPrefixVale extends string | undefined> =
  (TPrefixVale extends string
    ? {
        prefix: (value: string) => string;
      }
    : object) & {
    env: Env;
  };

type FieldsFn<TPrefixValue extends string | undefined, T extends object> = (
  args: FieldsArgsFn<TPrefixValue>,
) => () => T;

interface PrefixOptions<TValue extends string | undefined = undefined>
  extends PrefixForEnvOption {
  value?: TValue;
}

interface CompactConfigOptions<
  T extends object,
  TValue extends string | undefined = undefined,
> {
  registerAsName: string;

  prefixOptions?: PrefixOptions<TValue>;

  fields: FieldsFn<TValue, T>;
}

const prefixOptionsDefault: PrefixOptions<undefined> = { value: undefined };

@Module({})
export class CompactConfigModule {
  public static register<
    T extends object,
    TValue extends string | undefined = undefined,
  >({
    registerAsName,
    prefixOptions: {
      value,
      ...options
    } = prefixOptionsDefault as PrefixOptions<TValue>,
    fields,
  }: CompactConfigOptions<T, TValue>): DynamicModule {
    const prefix =
      value !== undefined ? prefixForEnv(value, options) : undefined;

    const fieldsArgs = {
      env: globalEnv,
      ...(prefix ? { prefix } : {}),
    } as FieldsArgsFn<TValue>;

    const config = registerAs(registerAsName, fields(fieldsArgs));

    return {
      module: CompactConfigModule,
      imports: [ConfigModule.forFeature(config)],
    };
  }
}
