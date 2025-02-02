import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

export const focusRing = tv({
  base: 'outline-none focus-visible:outline-none focus-visible:ring-4',
  variants: {
    isFocusVisible: {
      false: 'focus-visible:ring-transparent',
      true: 'focus-visible:ring-brand-bold-default/20',
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
