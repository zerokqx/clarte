import { ValueObject } from '@clarte/shared-domain/domain';

export class TextVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): TextVo {
    if (!value || value.trim().length === 0) {
      throw new Error('Notification text cannot be empty');
    }
    return new TextVo(value);
  }
  public static restore(value: string): TextVo {
    return new TextVo(value);
  }
}
