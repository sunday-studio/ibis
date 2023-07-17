import { makeAutoObservable } from 'mobx';

class AppState {
  sidebarIsOpen: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebarOpenState() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }
}

export const appState = new AppState();
