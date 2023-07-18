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
  }
}

export const appState = new AppState();
