import {
  Button as RACButton,
  ButtonProps as RACButtonProps,
  composeRenderProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

export interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'unstyled';
  size?: 'default' | 'small' | 'medium';
  isLoading?: boolean;
}

let button = tv({
  base: 'rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition text-center focus-visible:outline-none focus-visible:ring-4 enabled:active:scale-[0.98]',
  variants: {
    variant: {
      primary:
        'bg-orange-600 hover:bg-orange-700 pressed:bg-orange-800 text-white shadow-orange-500/20 focus-visible:ring-orange-500/20',
      secondary:
        'bg-white border border-neutral-200 text-gray-700 hover:bg-gray-50 pressed:bg-gray-100 focus-visible:ring-neutral-500/20 focus-visible:border-neutral-400',
      destructive:
        'bg-red-600 hover:bg-red-700 pressed:bg-red-800 focus-visible:ring-red-500/20 text-white',
      unstyled:
        'bg-transparent border-none shadow-none hover:bg-transparent pressed:bg-transparent focus-visible:ring-0 focus-visible:border-none text-inherit',
    },

    size: {
      default: 'w-full h-10',
      medium: 'px-4 h-8 text-sm text-center font-medium',
      small: 'px-2 h-6 text-xs text-center font-medium',
    },

    isDisabled: {
      true: 'bg-gray-400 shadow-none text-gray-300 forced-colors:text-[GrayText] border-black/5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export const Button = ({ variant = 'primary', size = 'medium', ...props }: ButtonProps) => {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant, size, className }),
      )}
    >
      {props?.isLoading ? (
        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
      ) : (
        props?.children
      )}
    </RACButton>
  );
};
