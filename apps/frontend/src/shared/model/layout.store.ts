import { makeAutoObservable } from 'mobx';

class LayoutStore {
  headerVisible = true;
  constructor() {
    makeAutoObservable(this);
  }

  toggleHeader() {
    this.headerVisible = !this.headerVisible;
  }
}
export const layoutStore = new LayoutStore()
