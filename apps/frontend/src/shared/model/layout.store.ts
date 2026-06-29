import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class LayoutStore {
  navbarVisible = true;
  headerVisible = true;
  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'LayoutStore',
      properties: Object.keys(this) as any,
      storage: window.localStorage,
    });
  }

  toggleNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }
  toggleHeader() {
    this.headerVisible = !this.headerVisible;
  }
  toggleZenMode() {
    this.navbarVisible = !this.navbarVisible;
    this.headerVisible = !this.headerVisible;
  }
}
export const layoutStore = new LayoutStore();
