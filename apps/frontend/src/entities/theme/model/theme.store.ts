import { MantineColor } from '@mantine/core';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { AVAILABLE_THEME_COLORS } from '../constants';

interface Props {
  primaryColor: MantineColor;
}

class ThemeStore {
  primaryColor!: MantineColor;
  constructor(props: Props) {
    Object.assign(this, props);
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'ThemeStore',
      properties: ['primaryColor'],
      storage: window.localStorage,
    });
  }

  changePrimaryColoor(newColor: string) {
    if (AVAILABLE_THEME_COLORS.includes(newColor)) this.primaryColor = newColor;
    else {
      console.warn(
        `Цвет "${newColor}" не разрешен. Доступные: ${AVAILABLE_THEME_COLORS.join(', ')}`,
      );
    }
  }
}
const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
export const themeStore = new ThemeStore({
  primaryColor: isSystemDark ? 'dark' : 'violet',
});
