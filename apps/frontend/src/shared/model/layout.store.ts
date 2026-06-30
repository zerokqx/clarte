import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class LayoutStore {
  navbarVisible = true;
  headerVisible = true;
  zenModeStatus = false;

  // Хранилище для предыдущего состояния, чтобы возвращать его при выходе из Zen Mode
  private _previousState = { navbarVisible: true, headerVisible: true };

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'LayoutStore',
      // Сохраняем только основные свойства, техническое _previousState сохранять в localStorage не обязательно
      properties: ['navbarVisible', 'headerVisible', 'zenModeStatus'],
      storage: window.localStorage,
    });
  }

  toggleNavbar() {
    // Не даем переключать навбар вручную, если включен Zen Mode
    if (this.zenModeStatus) return;
    this.navbarVisible = !this.navbarVisible;
  }

  toggleHeader() {
    // Не даем переключать хедер вручную, если включен Zen Mode
    if (this.zenModeStatus) return;
    this.headerVisible = !this.headerVisible;
  }

  toggleZenMode() {
    // Переключаем статус режима
    this.zenModeStatus = !this.zenModeStatus;

    if (this.zenModeStatus) {
      // 1. ВХОДИМ В ZEN MODE: Запоминаем текущее состояние перед скрытием
      this._previousState = {
        navbarVisible: this.navbarVisible,
        headerVisible: this.headerVisible,
      };
      // Прячем всё
      this.navbarVisible = false;
      this.headerVisible = false;
    } else {
      // 2. ВЫХОДИМ ИЗ ZEN MODE: Восстанавливаем то, что было скрыто
      this.navbarVisible = this._previousState.navbarVisible;
      this.headerVisible = this._previousState.headerVisible;
    }
  }
}

export const layoutStore = new LayoutStore();
