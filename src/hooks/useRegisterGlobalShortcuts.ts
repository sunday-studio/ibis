import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { toggleCommandDialogState, toggleSidebarState } from '@/app.store';

export const useRegisterAllShortcuts = () => {
  // const navigate = useNavigate();
  useHotkeys(`${Key.Meta}+d`, () => toggleSidebarState());
  useHotkeys(`${Key.Control}+d`, () => toggleSidebarState());
  useHotkeys(`${Key.Meta}+k`, () => toggleCommandDialogState());
  // useHotkeys(`${Key.Meta}+n`, () => {
  //   const entryId = entriesStore.addNewEntry();
  //   navigate(`/entry/${entryId}`);
  // });
  // useHotkeys(`${Key.Meta}+j`, () => {
  //   journalEntryState.goToToday();
  //   navigate('/today');
  // });
  // useHotkeys(`${Key.Meta}+b`, () => navigate('/trash'));
  // useHotkeys(`${Key.Meta}+t`, () => navigate('/templates'));
};
