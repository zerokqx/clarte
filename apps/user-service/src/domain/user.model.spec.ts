import { User } from './user.model';
import { AvatarWrongError } from '@/domain/exceptions/avatar-wrong';
import { IncorrectLoginFormatError } from '@/domain/exceptions/incrrect-login-format';

describe('User Domain Entity', () => {
  const defaultCreateDto = {
    id: 'user-123',
    login: 'testuser',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hash',
    avatarUrl: 'https://example.com/avatar.png',
  };

  describe('create()', () => {
    it('должен успешно создавать пользователя с валидными данными', () => {
      const user = User.create(defaultCreateDto);

      expect(user.id).toBe(defaultCreateDto.id);
      expect(user.login).toBe(defaultCreateDto.login);
      expect(user.passwordHash).toBe(defaultCreateDto.passwordHash);
      expect(user.avatarUrl).toBe(defaultCreateDto.avatarUrl);
    });

    it('должен выбрасывать ошибку, если передан невалидный логин', () => {
      expect(() => {
        User.create({ ...defaultCreateDto, login: '' });
      }).toThrow(IncorrectLoginFormatError);
    });

    it('должен выбрасывать ошибку, если передан невалидный аватар', () => {
      expect(() => {
        User.create({ ...defaultCreateDto, avatarUrl: 'invalid-url' });
      }).toThrow(AvatarWrongError);
    });
  });

  describe('restore()', () => {
    it('должен корректно восстанавливать пользователя из базы', () => {
      // restore() использует методы restore для вложенных VO, поэтому нет валидации
      const user = User.restore(defaultCreateDto);

      expect(user.id).toBe(defaultCreateDto.id);
      expect(user.login).toBe(defaultCreateDto.login);
      expect(user.passwordHash).toBe(defaultCreateDto.passwordHash);
      expect(user.avatarUrl).toBe(defaultCreateDto.avatarUrl);
    });
  });

  describe('behavior methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create({ ...defaultCreateDto });
    });

    it('changeAvatar() должен обновлять аватар', () => {
      const newAvatar = 'https://example.com/new-avatar.png';
      user.changeAvatar(newAvatar, 'https://example.com/default.png');
      expect(user.avatarUrl).toBe(newAvatar);
    });

    it('changeAvatar() должен устанавливать дефолтный аватар, если передан пустой', () => {
      const defaultAvatar = 'https://example.com/default.png';
      user.changeAvatar('', defaultAvatar);
      expect(user.avatarUrl).toBe(defaultAvatar);
    });

    it('changeLogin() должен обновлять логин', () => {
      const newLogin = 'new-user-login';
      user.changeLogin(newLogin);
      expect(user.login).toBe(newLogin);
    });

    it('changeLogin() должен выбрасывать ошибку при невалидном логине', () => {
      expect(() => user.changeLogin('')).toThrow(IncorrectLoginFormatError);
    });

    it('changeLogin() не должен ничего делать, если логин совпадает', () => {
      // Это просто для покрытия строчки `if (this._props.login.equals(newLogin)) return;`
      user.changeLogin(defaultCreateDto.login);
      expect(user.login).toBe(defaultCreateDto.login);
    });
  });

  describe('toPlain()', () => {
    it('должен возвращать плоский объект свойств пользователя', () => {
      const user = User.create(defaultCreateDto);
      const plain = user.toPlain();

      expect(plain).toEqual({
        id: defaultCreateDto.id,
        login: defaultCreateDto.login,
        passwordHash: defaultCreateDto.passwordHash,
        avatarUrl: defaultCreateDto.avatarUrl,
      });
    });
  });
});
