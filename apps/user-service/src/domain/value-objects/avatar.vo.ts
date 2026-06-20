import { ValueObject } from '@clarte/shared-domain/domain';
import { AvatarWrongError } from '@/domain/exceptions/avatar-wrong';

export class UserAvatar extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UserAvatar {
    const isDataUri = value.startsWith('data:image/');

    if (!isDataUri && !this.isValidUrl(value)) {
      throw new AvatarWrongError(
        'Передан некорректный формат URL или Data URI для аватара',
      );
    }

    return new UserAvatar(value);
  }

  private static isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  static restore(value: string): UserAvatar {
    return new UserAvatar(value);
  }
}
