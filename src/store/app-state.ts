import { APP_STATE, USER_DATA } from '@/lib/constants';
import { makeAutoObservable } from 'mobx';

import { getData, setData } from '../lib/storage';

type Theme = 'light' | 'night' | 'system';

const DEFAULT_APPSTATE = {
  theme: 'light',
  sidebarIsOpen: true,
};

class AppState {
  sidebarIsOpen: boolean = true;
  theme: Theme = 'light';
  session: any | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  load() {
    const state = getData(APP_STATE) ?? DEFAULT_APPSTATE;
    const session = getData(USER_DATA) || null;

    this.sidebarIsOpen = state.sidebarIsOpen;
    this.theme = state.theme;
    this.session = session;
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  toggleSidebarOpenState() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
    setData(APP_STATE, {
      sidebarIsOpen: this.sidebarIsOpen,
      theme: this.theme,
    });
  }

  turnOffTransitions() {
    const css = document.createElement('style');
    css.type = 'text/css';

    css.appendChild(
      document.createTextNode(
        `* {
        -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
          }`,
      ),
    );
    document.head.appendChild(css);

    return css;
  }

  removeTurnOffTranstions(css: HTMLStyleElement) {
    window.getComputedStyle(css).opacity;
    document.head.removeChild(css);
  }

  toggleTheme(t: Theme) {
    const css = this.turnOffTransitions();
    this.theme = t;
    document.documentElement.setAttribute('data-theme', t);
    setData(APP_STATE, {
      sidebarIsOpen: !this.sidebarIsOpen,
      theme: t,
    });

    this.removeTurnOffTranstions(css);
  }
}

export const appState = new AppState();
