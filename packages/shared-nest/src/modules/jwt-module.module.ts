import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { Jwt } from '@/strategies';
import { Contracts } from '@clarte/shared-contracts';
import { randomUUID } from 'crypto';
import { COOKIE_INTERCEPTOR_UUID } from '../ports/di-tokens';

// ---------------------------------------------------------------------------
// Опции для синхронной регистрации
// ---------------------------------------------------------------------------

/**
 * Опции синхронной регистрации {@link JwtModule}.
 *
 * @property provider - Класс или значение, реализующее {@link Contracts.Interfaces.IJwtKeyProvider}.
 * @property imports  - Дополнительные модули, необходимые провайдеру.
 */
export interface JwtModuleOptions {
  /** Класс, реализующий {@link Contracts.Interfaces.IJwtKeyProvider} */
  provider: Type<Contracts.Interfaces.IJwtKeyProvider>;
  /** Модули, экспортирующие зависимости провайдера (например AuthGrpcClientModule) */
  imports?: any[];
}

// ---------------------------------------------------------------------------
// Опции для асинхронной регистрации
// ---------------------------------------------------------------------------

/**
 * Опции асинхронной регистрации {@link JwtModule}.
 * Используй когда провайдер нужно создавать через фабрику.
 *
 * @property useFactory - Фабрика, возвращающая реализацию {@link Contracts.Interfaces.IJwtKeyProvider}.
 * @property inject     - Токены, которые будут переданы в фабрику.
 * @property imports    - Модули, экспортирующие зависимости провайдера.
 */
export interface JwtModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) =>
    | Promise<Contracts.Interfaces.IJwtKeyProvider>
    | Contracts.Interfaces.IJwtKeyProvider;
  inject?: any[];
  imports?: any[];
}

// ---------------------------------------------------------------------------
// Модуль
// ---------------------------------------------------------------------------

/**
 * Динамический модуль для регистрации JWT-стратегий (access и refresh).
 *
 * Принимает реализацию {@link Contracts.Interfaces.IJwtKeyProvider}, которая возвращает публичный
 * RSA-ключ — синхронно или асинхронно (например через gRPC к auth-service).
 *
 * Ключ запрашивается **лениво** внутри стратегии при первом входящем JWT-запросе,
 * что устраняет гонку при старте приложения.
 *
 * @example Синхронная регистрация (класс)
 * ```ts
 * JwtModule.register({
 *   imports: [AuthGrpcClientModule],
 *   provider: AuthJwtKeyProvider,
 * })
 * ```
 *
 * @example Асинхронная регистрация (фабрика)
 * ```ts
 * JwtModule.registerAsync({
 *   imports: [AuthGrpcClientModule],
 *   inject: [AuthJwtKeyProvider],
 *   useFactory: (p: AuthJwtKeyProvider) => p,
 * })
 * ```
 */
@Global()
@Module({})
export class JwtModule {
  /**
   * Регистрирует модуль, используя класс-провайдер ключа.
   * @param options - Конфигурация с классом, реализующим {@link Contracts.Interfaces.IJwtKeyProvider}.
   */
  static register(options: JwtModuleOptions): DynamicModule {
    const keyProvider: Provider = {
      provide: Contracts.JWT_KEY_PROVIDER,
      useClass: options.provider,
    };

    return JwtModule.buildModule(options.imports ?? [], [keyProvider]);
  }

  /**
   * Регистрирует модуль асинхронно через фабрику.
   *
   * @param options - Конфигурация с фабрикой, возвращающей {@link Contracts.Interfaces.IJwtKeyProvider}.
   */
  static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    const keyProvider: Provider = {
      provide: Contracts.JWT_KEY_PROVIDER,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    return JwtModule.buildModule(options.imports ?? [], [keyProvider]);
  }

  // ---------------------------------------------------------------------------
  // Приватный хелпер — сборка DynamicModule
  // ---------------------------------------------------------------------------

  private static buildModule(
    imports: any[],
    extraProviders: Provider[],
  ): DynamicModule {
    return {
      module: JwtModule,
      imports,
      providers: [
        ...extraProviders,
        Jwt.AccesStrategy,
        Jwt.RefreshStrategy,
        {
          provide: COOKIE_INTERCEPTOR_UUID,
          useValue: randomUUID(),
        },
      ],
      exports: [
        Jwt.AccesStrategy,
        Jwt.RefreshStrategy,
        COOKIE_INTERCEPTOR_UUID,
      ],
    };
  }
}
