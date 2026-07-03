import { MantineColor } from '@mantine/core';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class UiStore {
  primaryColor: MantineColor = 'red';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'UiStore', properties: ['primaryColor'] });
  }

  changePrimaryColor(newColor: MantineColor) {
    this.primaryColor = newColor;
  }
}

export const uiStore = new UiStore();
