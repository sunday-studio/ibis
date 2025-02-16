import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableElement } from './components/DraggableElement';
import { OnDragLine } from './components/DraggableLine';
import { useOnDrop } from './hooks/use-on-drop.hook';
import { useDragListeners } from './hooks/use-drag-listeners.hook';
import { createPortal } from 'react-dom';
import { DRAGGABLE_WRAPPER_ID } from './components/DraggableWrapper';

export const DraggableBlockPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useDragListeners();
  useOnDrop();

  const isEditable = editor.isEditable();

  const wrapperHtmlElement = document.getElementById(DRAGGABLE_WRAPPER_ID);

  if (!isEditable || !wrapperHtmlElement) {
    return null;
  }

  return (
    <>
      <DraggableElement />
      <OnDragLine />
    </>
  );

  return createPortal(
    <>
      <OnDragLine />
    </>,
    wrapperHtmlElement,
  );
};
