import { ValueObject } from '@clarte/shared-domain/domain';
import { IdInvalidException } from '../exceptions';

export class IdVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): IdVo {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(value))
      throw new IdInvalidException('One of the identifiers is incorrect');
    return new IdVo(value);
  }
  public static restore(value: string): IdVo {
    return new IdVo(value);
  }
}
