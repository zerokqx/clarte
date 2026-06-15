import { DDD } from '@clarte/shared-domain';
import { AvatarWrongError } from '@/domain/exceptions/avatar-wrong';

export class UserAvatar extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UserAvatar {
    const URL_REGEX =
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    const isDataUri = value.startsWith('data:image/');
    if (!URL_REGEX.test(value) && !isDataUri) {
      throw new AvatarWrongError('Передан некорректный формат URL для аватара');
    }
    return new UserAvatar(value);
  }

  static restore(value: string): UserAvatar {
    return new UserAvatar(value);
  }
}
