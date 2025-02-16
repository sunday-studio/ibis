import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableElement } from './components/DraggableElement';
import { OnDragLine } from './components/DraggableLine';
import { useOnDrop } from './hooks/use-on-drop.hook';
import { useDragListeners } from './hooks/use-drag-listeners.hook';
import { createPortal } from 'react-dom';
import { useDraggableStore } from './draggable-block-store';
import { DRAGGABLE_WRAPPER_ID } from './components/DraggableWrapper';
import { useShallow } from 'zustand/react/shallow';

export const DraggableBlockPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const { isMarkdown } = useShallow(useDraggableStore);

  useDragListeners();
  useOnDrop();

  const isEditable = editor.isEditable();

  const wrapperHtmlElement = document.getElementById(DRAGGABLE_WRAPPER_ID);

  if (!isEditable || !wrapperHtmlElement || isMarkdown) {
    return null;
  }

  return createPortal(
    <>
      <DraggableElement />
      <OnDragLine />
    </>,
    wrapperHtmlElement,
  );
};
