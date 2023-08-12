import { makeAutoObservable } from 'mobx';

import { APP_STATE } from '../lib/constants';
import { getData, setData } from '../lib/storage';

type Theme = 'light' | 'night' | 'system';

const DEFAULT_APPSTATE = {
  theme: 'night',
  sidebarIsOpen: true,
};

class AppState {
  sidebarIsOpen: boolean = true;
  theme: Theme = 'light';

  constructor() {
    makeAutoObservable(this);
  }

  load() {
    const state = getData(APP_STATE) ?? DEFAULT_APPSTATE;

    this.sidebarIsOpen = state.sidebarIsOpen;
    this.theme = state.theme;
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  toggleSidebarOpenState() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
    setData(APP_STATE, {
      sidebarIsOpen: this.sidebarIsOpen,
      theme: this.theme,
    });
  }

  toggleTheme(t: Theme) {
    this.theme = t;
    document.documentElement.setAttribute('data-theme', t);
    setData(APP_STATE, {
      sidebarIsOpen: !this.sidebarIsOpen,
      theme: t,
    });
  }
}

export const appState = new AppState();
