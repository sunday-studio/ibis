import { makeAutoObservable } from 'mobx';

import { APP_STATE, USER_DATA } from '@/lib/constants';

import { getData, setData } from '../lib/storage';

type Theme = 'light' | 'night' | 'system';

const DEFAULT_APPSTATE = {
  theme: 'light',
  sidebarIsOpen: true,
};

const ZEN_MODE_KEY = 'zen-mode';

class AppState {
  sidebarIsOpen: boolean = true;
  theme: Theme = 'light';
  session: any | null = null;
  isZenMode: boolean = false;

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
    document.documentElement.setAttribute('zen-mode', 'off');
  }

  toggleZenMode() {
    const isZenModeOff = document.documentElement.getAttribute(ZEN_MODE_KEY) === 'off';

    if (isZenModeOff) {
      document.documentElement.setAttribute(ZEN_MODE_KEY, 'on');
      this.sidebarIsOpen = false;
    } else {
      document.documentElement.setAttribute(ZEN_MODE_KEY, 'off');
    }
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
        `*, *::before, *::after {
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
