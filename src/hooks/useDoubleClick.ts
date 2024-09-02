import { useCallback, useEffect, useRef, useState } from 'react';

type Callback = () => void;

export const useDoubleClick = ({
  onDoubleClick,
  timeout,
  onClick,
}: {
  onDoubleClick: Callback;
  timeout?: number;
  onClick?: Callback;
}): (() => void) => {
  const [clicks, setClicks] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setClicks((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const delay = timeout ?? 300;

    if (clicks === 1) {
      timer.current = setTimeout(() => {
        onClick();
        setClicks(0);
      }, delay);
    } else if (clicks === 2) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      onDoubleClick();
      setClicks(0);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [clicks, onClick, onDoubleClick, timeout]);

  return handleClick;
};
