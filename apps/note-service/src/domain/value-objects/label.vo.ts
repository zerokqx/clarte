import { ValueObject } from '@clarte/shared-domain/domain';
import { InvalidLabel } from '../exceptions';

export class LabelVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): LabelVo {
    if (!value || value.trim() === '') {
      throw new InvalidLabel('The label does not exist or it is not correct');
    }
    return new LabelVo(value.trim());
  }

  public static restore(value: string): LabelVo {
    return new LabelVo(value);
  }
}
