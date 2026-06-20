import { ValueObject } from '@clarte/shared-domain/domain';
import { InvalidText } from '../exceptions';

export class TextVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): TextVo {
    if (!value || value.trim() === '')
      throw new InvalidText('The text does not exist or it is not correct');
    return new TextVo(value);
  }

  public static restore(value: string): TextVo {
    return new TextVo(value);
  }
}
