import { useRef, useState } from 'react';
import { FC } from 'react';

import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

interface TooltipProps {
  trigger: React.ReactNode;
  shortcuts?: string[];
  content: string | React.ReactElement;
  shouldFlip?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  leaveDuration?: number;
  hoverDuration?: number;
  showArrow?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  trigger,
  content,
  shortcuts,
  placement = 'top',
  shouldFlip = true,
  leaveDuration = 10,
  hoverDuration = 200,
  showArrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), shouldFlip && flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      delay: {
        open: hoverDuration,
        close: leaveDuration,
      },
    }),
    useRole(context),
    useDismiss(context),
    useClick(context),
  ]);

  const contentElement =
    typeof content === 'string' ? (
      <p className="text-sm font-medium text-gray-50 flex flex-col gap-1">
        {content}
        {shortcuts && shortcuts.length > 0 ? (
          <span className="text-xs text-neutral-400">
            {shortcuts.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </span>
        ) : null}
      </p>
    ) : (
      content
    );

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </span>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="text-sm font-semibold py-2 px-2 rounded-lg box-border max-w-xs shadow-1 bg-neutral-800 z-100000"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            {...getFloatingProps()}
          >
            {showArrow && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                tipRadius={3}
                className="fill-neutral-800"
              />
            )}
            {contentElement}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
