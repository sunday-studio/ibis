import { forwardRef } from 'react';
import {
  composeRenderProps,
  FieldErrorProps,
  Group,
  GroupProps,
  InputProps,
  LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  TextArea as RACTextArea,
  Text,
  TextAreaProps,
  TextProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { composeTailwindRenderProps, focusRing } from './utils';

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        'text-sm text-text-primary font-medium cursor-default w-fit',
        props.className,
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge('text-sm text-text-secondary', props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'text-sm text-red-600 forced-colors:text-[Mark]',
      )}
    />
  );
}

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: 'outline-transparent',
      true: 'hover:border-brand-bold-default border-brand-bold-default',
    },
    isInvalid: {
      true: 'border-brand-destructive hover:border-brand-destructive focus-visible:ring-brand-destructive/20 border-brand-destructive',
    },
    isDisabled: {
      true: 'bg-brand-surface-secondary text-text-secondary',
    },
  },
});

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: 'group flex items-center h-9 bg-white  forced-colors:bg-[Field] border-2 rounded-lg overflow-hidden',
  variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <RACInput
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        'px-3 py-2 flex-1 min-w-0 bg-white text-sm text-gray-800',
      )}
    />
  );
});

export const FieldTextarea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  return (
    <RACTextArea
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        'px-3 py-2 flex-1 min-w-0 bg-white text-sm text-gray-800',
      )}
    />
  );
});
