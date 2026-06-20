import { IUserAvatarGenerator } from '@/application';

export class UserAvatarGenerator implements IUserAvatarGenerator {
  generate(login: string): string {
    const url = `https://api.dicebear.com/10.x/identicon/svg?backgroundColor=ffffff&scale=0.8&seed=${login}`;
    // const style = new Style(definition);
    // const avatar = new Avatar(style, {
    //   backgroundColor: ['ffffff'],
    //   scale: 0.8,
    //   seed: login,
    // });
    // const svg = avatar.toDataUri();
    // return svg;
    return url;
  }
}
