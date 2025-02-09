import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

export const focusRing = tv({
  base: 'outline-none focus-visible:outline-none focus-visible:ring-4',
  variants: {
    isFocusVisible: {
      false: 'focus-visible:ring-transparent',
      true: 'focus-visible:ring-orange-500/20 border-orange-500',
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
