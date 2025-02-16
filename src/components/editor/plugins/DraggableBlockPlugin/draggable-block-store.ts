import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Draggable = {
  htmlElement: HTMLElement;
  data: {
    top: number;
    left: number;
    height: number;
  };
};

type Line = {
  htmlElement: HTMLElement;
  data: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
};

export interface DraggableBlockStoreProps {
  draggable?: Draggable;
  setDraggable: (value: Draggable) => void;
  line?: Line;
  setLine: (value: Line) => void;
  resetState: () => void;
}

export const draggableStore = create<DraggableBlockStoreProps, [['zustand/devtools', never]]>(
  devtools(
    (setState, getState) => ({
      draggable: undefined,
      setDraggable: (value) => {
        setState(
          {
            draggable: value,
          },
          false,
          { type: 'setDraggable', value },
        );
      },
      resetState: () => {
        setState(
          {
            draggable: undefined,
            line: undefined,
          },
          false,
          { type: 'resetState' },
        );
      },
      line: undefined,
      setLine: (newLine) => {
        const prevLine = getState().line?.data;

        if (
          prevLine?.top === newLine.data.top &&
          prevLine?.left === newLine.data.left &&
          prevLine?.height === newLine.data.height &&
          prevLine?.width === newLine.data.width
        ) {
          return;
        }

        setState(
          {
            line: newLine,
          },
          false,
          { type: 'setLine', value: newLine },
        );
      },
    }),
    { name: 'draggableStore' },
  ),
);

export const useDraggableStore = () =>
  draggableStore(({ draggable, resetState }) => ({
    draggable,
    resetState,
  }));

export const useDraggableLineStore = () =>
  draggableStore(({ line }) => ({
    line,
  }));
