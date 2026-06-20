import { ValueObject } from '@clarte/shared-domain/domain';
import { DateException } from '../exceptions';

export class DueDateVo extends ValueObject<Date> {
  private constructor(value: Date) {
    super(value);
  }

  public static create(value: Date): DueDateVo {
    if (isNaN(value.getTime())) {
      throw new DateException('Предоставлена невалидная дата.');
    }

    const now = new Date();

    now.setHours(0, 0, 0, 0);
    const targetDate = new Date(value);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < now) {
      throw new DateException('Дата выполнения не может быть в прошлом.');
    }

    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 50);
    if (targetDate > maxFutureDate) {
      throw new DateException(
        'Дата выполнения находится слишком далеко в будущем.',
      );
    }

    return new DueDateVo(value);
  }

  public static restore(value: Date): DueDateVo {
    return new DueDateVo(value);
  }
}
