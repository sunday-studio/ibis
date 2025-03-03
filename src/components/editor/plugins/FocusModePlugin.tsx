import { useEffect, useRef } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isNodeSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { useSnapshot } from 'valtio';

import { editorModeState } from '@/app.store';

function getBlockElement(editor: LexicalEditor): HTMLElement | null {
  let blockElem: HTMLElement | null = null;

  editor.getEditorState().read(() => {
    const selection = $getSelection();

    if (!selection) {
      return null;
    }

    let node;
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      node = anchor.getNode();
    } else if ($isNodeSelection(selection)) {
      node = selection.getNodes()[0];
    } else {
      return null;
    }

    // Get the top-level block element
    while (node && node.getParent()?.getParent()) {
      node = node.getParent();
    }

    if (!node) {
      return null;
    }

    const nodeKey = node.getKey();
    blockElem = editor.getElementByKey(nodeKey);
  });

  return blockElem;
}

export const FocusModePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const isFocusMode = useSnapshot(editorModeState).isFocusMode;
  const currentBlock = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isFocusMode) {
      return;
    }

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const block = getBlockElement(editor);

        // Remove active-block class from previous block if it exists
        if (currentBlock.current && currentBlock.current !== block) {
          currentBlock.current.classList.remove('active-block');
        }

        // Add active-block class to new block
        if (block && block !== currentBlock.current) {
          block.classList.add('active-block');
          currentBlock.current = block;
        }
      });
    });

    return () => {
      // Clean up by removing class from current block
      if (currentBlock.current) {
        currentBlock.current.classList.remove('active-block');
      }
      unregister();
    };
  }, [editor, isFocusMode]);

  return null;
};
