import { RefObject, useEffect, useRef, useState } from 'react';

interface UseHoverToggleProps {
  ref: RefObject<HTMLElement>;
  leaveDuration?: number;
  hoverDuration?: number;
  onHoverCallback: () => void;
  onLeaveCallback: () => void;
}

export function useHoverToggle({
  ref,
  hoverDuration = 300,
  onHoverCallback,
  leaveDuration = 100,
  onLeaveCallback,
}: UseHoverToggleProps) {
  const hoverTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }

      hoverTimeoutRef.current = setTimeout(() => {
        onHoverCallback();
      }, hoverDuration);
    };

    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      leaveTimeoutRef.current = setTimeout(() => {
        onLeaveCallback();
      }, leaveDuration);
    };

    const element = ref.current;

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, [ref, hoverDuration, leaveDuration, onHoverCallback, onLeaveCallback]);
}

export default useHoverToggle;
