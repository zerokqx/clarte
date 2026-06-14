// packages/shared/src/domain/common/exceptions/domain.exception.ts

export class DomainException extends Error {
  /**
   * Уникальный бизнес-код ошибки (например, 'USER_ALREADY_EXISTS', 'INVALID_PASSWORD')
   * По нему фронтенд или другие сервисы поймут, что пошло не так.
   */
  public readonly code: string;

  /**
   * Дополнительный контекст (например, { minLength: 8, actualLength: 5 })
   */
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    code = 'DOMAIN_ERROR',
    metadata?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.metadata = metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
