import { UserAvatar } from './avatar.vo';
import { AvatarWrongError } from '@/domain/exceptions/avatar-wrong';

describe('UserAvatar', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном data URI', () => {
      const dataUri =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      const vo = UserAvatar.create(dataUri);
      expect(vo.value).toBe(dataUri);
    });

    it('должен успешно создавать VO при валидном http/https URL', () => {
      const httpUrl = 'http://example.com/avatar.png';
      const httpsUrl = 'https://example.com/avatar.png';

      expect(UserAvatar.create(httpUrl).value).toBe(httpUrl);
      expect(UserAvatar.create(httpsUrl).value).toBe(httpsUrl);
    });

    it('должен выбрасывать ошибку AvatarWrongError при некорректном формате', () => {
      expect(() => UserAvatar.create('not-a-url')).toThrow(AvatarWrongError);
      expect(() => UserAvatar.create('ftp://example.com/image.png')).toThrow(AvatarWrongError);
      expect(() => UserAvatar.create('')).toThrow(AvatarWrongError);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someText = 'restored-avatar-url';
      const vo = UserAvatar.restore(someText);
      expect(vo.value).toBe(someText);
    });
  });
});
