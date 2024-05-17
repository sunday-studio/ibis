import { useLayoutEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';

// TODO: convert this into a shortcut plugin
export default function SearchDialogPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    const onkeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key == 'k') {
        // TODO: figure out a way to return the focus back to page when this is closed
        searchStore.toggleSearchModal();
      }

      if ((e.metaKey || e.ctrlKey) && e.key == 'd') {
        appState.toggleSidebarOpenState();
      }
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('keydown', onkeyDown);
      }

      if (rootElement !== null) {
        rootElement.addEventListener('keydown', onkeyDown);
      }
    });
  }, [editor]);

  return null;
}
