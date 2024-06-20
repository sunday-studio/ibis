import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { Key } from 'ts-key-enum';

import { appState, entriesStore, journalEntryState, searchStore } from '@/store/index';

export const useRegisterAllShortcuts = () => {
  const navigate = useNavigate();

  useHotkeys(`${Key.Meta}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Meta}+k`, () => searchStore.toggleSearchModal());
  useHotkeys(`${Key.Meta}+n`, () => {
    const entryId = entriesStore.addNewEntry();
    navigate(`/entry/${entryId}`);
  });

  useHotkeys(`${Key.Meta}+j`, () => {
    journalEntryState.goToToday();
    navigate('/today');
  });

  useHotkeys(`${Key.Meta}+b`, () => navigate('/trash'));
  useHotkeys(`${Key.Meta}+t`, () => navigate('/templates'));
};
