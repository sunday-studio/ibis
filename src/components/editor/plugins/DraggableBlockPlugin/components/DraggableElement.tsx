import React, { DragEvent as ReactDragEvent, useCallback } from 'react';
import { useDraggableStore } from '../draggable-block-store';
import { useShallow } from 'zustand/react/shallow';

import './_draggable-element.css';
import { GripVerticalIcon } from 'lucide-react';

const DraggableElement: React.FC = () => {
  const { draggable, resetState } = useShallow(useDraggableStore);

  const handleOnDragStart = useCallback(
    ({ dataTransfer }: ReactDragEvent<HTMLDivElement>) => {
      if (!dataTransfer || !draggable?.htmlElement) {
        return;
      }

      dataTransfer.setDragImage(draggable.htmlElement, 0, 0);
    },
    [draggable?.htmlElement],
  );

  if (!draggable?.data) {
    return null;
  }

  const scrollOffset = document.body.getBoundingClientRect().top;

  return (
    <div
      draggable={true}
      className="draggable-element"
      onDragStart={handleOnDragStart}
      onDragEnd={resetState}
      style={{
        top: draggable.data.top - scrollOffset,
        left: (draggable.data.left ?? 0) - 23,
        height: draggable.data.height,
      }}
    >
      <GripVerticalIcon className="w-4 h-4" />
    </div>
  );
};

const Memoized = React.memo(DraggableElement, () => true);

export { Memoized as DraggableElement };
