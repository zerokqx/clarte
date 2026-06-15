import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/identicon.json' with { type: 'json' };
import { IUserAvatarGenerator } from '@/application';

export class UserAvatarGenerator implements IUserAvatarGenerator {
  generate(login: string): string {
    const style = new Style(definition);
    const avatar = new Avatar(style, {
      backgroundColor: ['ffffff'],
      scale: 0.8,
      seed: login,
    });
    const svg = avatar.toDataUri();
    return svg;
  }
}
