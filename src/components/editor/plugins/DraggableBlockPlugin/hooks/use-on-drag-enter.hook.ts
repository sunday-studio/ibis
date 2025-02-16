import { draggableStore } from '../draggable-block-store';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAGGABLE_KEY, isHTMLElement } from '../guard';
import { useCallback } from 'react';

export const useOnDragEnter = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnDragEnter = useCallback(
    (event: DragEvent): boolean => {
      // Without this drop will not work;
      event.preventDefault();

      const target = event.currentTarget;

      if (!isHTMLElement(target)) {
        console.error('[On drag enter] CurrentTarget is not Html element');
        return false;
      }

      // Use value that we set before.
      const key = target.getAttribute(DRAGGABLE_KEY);

      if (!key) {
        return false;
      } else {
        console.log(`Lexical node key is ${key}`);
      }

      const element = editor.getElementByKey(key);

      if (!isHTMLElement(element)) {
        console.error('[handleOnDragEnter] element is not HTMLElement');
        return false;
      }

      const coordinates = element.getBoundingClientRect();

      if (coordinates) {
        draggableStore.getState().setLine({
          htmlElement: element,
          data: {
            top: coordinates.top,
            left: coordinates.left,
            height: coordinates.height,
            width: coordinates.width,
          },
        });
      }

      return true;
    },
    [editor],
  );

  return { handleOnDragEnter };
};
