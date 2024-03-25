import { useLayoutEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Key } from 'ts-key-enum';

import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';

export default function SearchDialogPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    const onkeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

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
        console.log('called one', prevRootElement);
      }

      if (rootElement !== null) {
        rootElement.addEventListener('keydown', onkeyDown);
        console.log('called two', rootElement);
      }
    });
  }, [editor]);

  return null;
}
