import { makeAutoObservable } from 'mobx';

type Theme = 'light' | 'night' | 'system';

class AppState {
  sidebarIsOpen: boolean = true;
  theme: Theme = 'light';

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebarOpenState() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  toggleTheme(t: Theme) {
    this.theme = t;

    document.documentElement.setAttribute('data-theme', t);

    // const tag = document.documentElement.getAttribute('data-theme');

    // console.log('html =>', tag);

    // html.dataset.theme = this.theme;
  }
}

export const appState = new AppState();
