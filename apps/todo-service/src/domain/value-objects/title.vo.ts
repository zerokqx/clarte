import { ValueObject } from '@clarte/shared-domain/domain';
import {
  LengthTitleInvalidException,
} from '../exceptions';

export class TitleVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): TitleVo {
    if (value.length > 50 || value.length < 10)
      throw new LengthTitleInvalidException(
        'Incorrect text length. The length cannot be more than 50 and less than 10',
      );
    return new TitleVo(value);
  }
  public static restore(value: string): TitleVo {
    return new TitleVo(value);
  }
}
