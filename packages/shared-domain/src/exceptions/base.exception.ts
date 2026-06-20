export abstract class ProblemDetailsException extends Error {
  /**
   * URI-ссылка, которая идентифицирует тип проблемы (по стандарту).
   * В микросервисах сюда часто пишут уникальный строковый код ошибки.
   * Пример: 'https://api.my-app.com/errors/user-not-found' или просто 'errors:user-not-found'
   */
  abstract readonly type: string;

  /**
   * Краткое, человекочитаемое описание типа проблемы.
   * Оно НЕ должно меняться от запроса к запросу (строго зашито для этого типа ошибки).
   * Пример: 'User Not Found'
   */
  abstract readonly title: string;

  /**
   * HTTP-статус код, наиболее подходящий для этой ошибки (по спецификации RFC).
   * Даже в gRPC мы можем хранить этот аналог, чтобы Gateway легко мапил его.
   * Пример: 404
   */
  abstract readonly status: number;

  /**
   * Дополнительный контекст: динамические детали ошибки, специфичные для этого вызова.
   * Сюда мы можем закинуть, например, список невалидных полей или id, который не нашли.
   */
  readonly extensions?: Record<string, any>;

  constructor(
    detail: string, // Конкретное описание: "Пользователь с id 123 не найден"
    extensions?: Record<string, any>,
  ) {
    // В базовый Error.message уходит подробный detail
    super(detail);

    this.name = this.constructor.name;
    this.extensions = extensions;

    // Чистим стек-трейс от конструкторов
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Метод для сериализации ошибки в чистый RFC 7807 JSON-объект
   */
  public toProblemDetails() {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.message, // Переименовываем message обратно в detail по стандарту
      ...this.extensions, // По спецификации RFC 7807, кастомные поля пишутся на верхнем уровне объекта
    };
  }
}
