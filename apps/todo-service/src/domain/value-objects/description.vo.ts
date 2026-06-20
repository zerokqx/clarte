import { ValueObject } from '@clarte/shared-domain/domain';
import {
  LengthDescriptionInvalidException,
} from '../exceptions';

export class DescriptionVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): DescriptionVo {
    if (value.length > 1000 || value.length < 10)
      throw new LengthDescriptionInvalidException(
        'Incorrect text length. The length cannot be more than 1000 and less than 10',
      );
    return new DescriptionVo(value);
  }
  public static restore(value: string): DescriptionVo {
    return new DescriptionVo(value);
  }
}
