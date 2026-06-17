import { ValueObject } from '@clarte/shared-domain/domain';

export class TitleVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): TitleVo {
    if (!value || value.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (value.length > 255) {
      throw new Error('Title cannot be longer than 255 characters');
    }
    return new TitleVo(value);
  }
  public static restore(value: string): TitleVo {
    return new TitleVo(value);
  }
}
