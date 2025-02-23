import { JSX, useLayoutEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { toggleSidebarState } from '@/app.store';

export const ShortcutPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    const onkeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key == 'k') {
        // TODO: figure out a way to return the focus back to page when this is closed
        // searchStore.toggleSearchModal();
      }

      if ((e.metaKey || e.ctrlKey) && e.key == 'd') {
        toggleSidebarState();
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
};
