import { cloneElement, useEffect, useRef } from 'react';

import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { AriaPopoverProps, Placement } from 'react-aria';
import { useOverlayTrigger } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';

import { useHoverToggle } from './useHoverToggle';

interface TooltipContentProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export const Popover = (props: TooltipContentProps) => {
  const { offset = 8, state, children } = props;

  let popoverRef = useRef(null);
  let { popoverProps, arrowProps, placement } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state,
  );

  return (
    <Overlay>
      <div {...popoverProps} ref={popoverRef} className="tooltip-container">
        <svg {...arrowProps} className="arrow" data-placement={placement} viewBox="0 0 12 12">
          <path d="M0 0 L6 6 L12 0" />
        </svg>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
};

interface TooltipProps {
  trigger: any;
  shortcuts?: string[];
  content: string | React.ReactElement;
  shouldFlip?: boolean;
  placement?: Placement;
}

export const Tooltip = ({ trigger, content, shortcuts, ...rest }: TooltipProps) => {
  const { shouldFlip = false, placement = 'bottom', ...props } = rest;
  let ref = useRef(null);
  let state = useOverlayTriggerState({
    ...props,
  });
  let {
    triggerProps: { onPress, ...restOfTriggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'dialog' }, state, ref);

  useHoverToggle({
    ref,
    onHoverCallback: () => state.setOpen(true),
    onLeaveCallback: () => state.setOpen(false),
  });

  const contentElemenet = () => {
    if (typeof content === 'string') {
      return (
        <p className="tooltip-content">
          {content}
          {shortcuts?.length > 0 ? (
            <span className="tooltip-shortcuts">
              {shortcuts.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </span>
          ) : null}
        </p>
      );
    }

    return content;
  };

  return (
    <>
      <span {...restOfTriggerProps} ref={ref} className="tooltip-trigger">
        {trigger}
      </span>
      {state.isOpen && (
        <Popover
          {...props}
          placement={placement}
          shouldFlip={shouldFlip}
          triggerRef={ref}
          state={state}
        >
          {cloneElement(contentElemenet(), overlayProps)}
        </Popover>
      )}
    </>
  );
};
