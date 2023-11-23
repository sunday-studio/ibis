import { makeAutoObservable } from 'mobx';

class SearchState {
  showSearchModal: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSearchModal() {
    this.showSearchModal = !this.showSearchModal;
  }
}

export const searchStore = new SearchState();
