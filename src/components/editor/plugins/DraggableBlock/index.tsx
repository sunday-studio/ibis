import type { JSX, RefObject } from 'react';
import { useRef } from 'react';

import { GripVerticalIcon } from 'lucide-react';

import { DraggableBlockPluginInternal } from './DraggableBlockPlugin';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPluginInternal
      anchorElem={anchorElem}
      menuRef={menuRef as RefObject<HTMLElement>}
      targetLineRef={targetLineRef as RefObject<HTMLElement>}
      menuComponent={
        <div ref={menuRef} className="draggable-block-menu">
          <GripVerticalIcon size={18} />
        </div>
      }
      targetLineComponent={<div ref={targetLineRef} className="draggable-block-target-line" />}
      isOnMenu={isOnMenu}
    />
  );
}
