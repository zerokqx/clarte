import { LoginInvalidError } from '@/domain/exceptions';
import { LoginVo } from './login.vo';

describe('LoginVo Test', () => {
  const login = 'test-user';

  it('неверный формат логина', () => {
    expect(() => LoginVo.create('')).toThrow(LoginInvalidError);
    expect(() => LoginVo.create('       ')).toThrow(LoginInvalidError);
  });

  it('верный логин', () => {
    const vo = LoginVo.create(login);
    expect(vo.value).toEqual(login);
  });

  it('restore тестирование', () => {
    expect(LoginVo.restore(login).value).toEqual(login);
  });
});
