import { DDD } from '@clarte/shared';

export class UserAvatar extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UserAvatar {
    const URL_REGEX =
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    if (!URL_REGEX.test(value)) {
      throw new Error('Передан некорректный формат URL для аватара');
    }
    return new UserAvatar(value);
  }

  static restore(value: string): UserAvatar {
    return new UserAvatar(value);
  }
}
