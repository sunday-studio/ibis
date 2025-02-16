import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { draggableStore } from '../draggable-block-store';

export const useEditorKeys = () => {
  const [editor] = useLexicalComposerContext();

  const resetState = useCallback(() => {
    draggableStore.getState().resetState();
  }, []);

  const getEditorKeys = useCallback(() => {
    return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
  }, [editor]);

  const [keys, setKeys] = useState<string[]>(getEditorKeys());

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setKeys(getEditorKeys());
      resetState();
    });
  }, [editor, getEditorKeys, resetState]);

  return { keys };
};
