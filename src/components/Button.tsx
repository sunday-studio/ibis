import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

export interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'default' | 'small' | 'medium';
  isLoading?: boolean;
}

let button = tv({
  base: 'rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition text-center focus-visible:outline-none focus-visible:ring-4 enabled:active:scale-[0.98]',
  variants: {
    variant: {
      primary:
        'bg-brand-bold-default hover:bg-border-button pressed:bg-border-button text-white shadow-blue-500/20 focus-visible:ring-brand-bold-default/20',
      secondary:
        'bg-white border border-border-default text-text-primary text-text-primary focus-visible:ring-brand-bold-default/20 focus-visible:border-brand-bold-default',
      destructive:
        'bg-brand-destructive hover:bg-brand-destructive/80 pressed:bg-brand-destructive/90 focus-visible:ring-brand-destructive/20 text-white',
    },

    size: {
      default: 'w-full h-10',
      medium: 'px-4 h-8 text-sm text-center  font-medium',
      small: 'px-2 h-6 text-xs text-center  font-medium',
    },

    isDisabled: {
      true: 'bg-brand-bold-default/50 shadow-none text-text-secondary forced-colors:text-[GrayText] border-black/5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export const Button = ({ variant, size, ...props }: ButtonProps) => {
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
