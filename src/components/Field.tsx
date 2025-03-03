import { forwardRef } from 'react';

import {
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
  composeRenderProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { composeTailwindRenderProps, focusRing } from './utils';

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge('text-sm text-gray-900 font-medium cursor-default w-fit', props.className)}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge('text-sm text-gray-500', props.className)}
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
  extend: focusRing,
  variants: {
    isFocusWithin: {
      false: 'outline-transparent',
      true: 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20',
    },
    isInvalid: {
      true: 'border-red-600 hover:border-red-600 focus-visible:ring-red-500/20 border-red-600',
    },
    isDisabled: {
      true: 'bg-gray-400 shadow-none text-gray-300 forced-colors:text-[GrayText] border-black/5',
    },
  },
});

export const fieldGroupStyles = tv({
  base: 'rounded-lg flex items-center h-9 bg-white forced-colors:bg-[Field] border-2 overflow-hidden shadow-sm transition focus-visible:outline-none focus-visible:ring-4',
  variants: {
    isFocusWithin: {
      false: 'outline-transparent',
      true: 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20',
    },
    isInvalid: {
      true: 'border-red-600 hover:border-red-600 focus-visible:ring-red-500/20 border-red-600',
    },
    isDisabled: {
      true: 'bg-gray-400 shadow-none text-gray-300 forced-colors:text-[GrayText] border-black/5',
    },
  },
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
        'px-3 py-2 flex-1 min-w-0 bg-white text-sm text-gray-900',
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
        'px-3 py-2 flex-1 min-w-0 bg-white text-sm text-gray-900',
      )}
    />
  );
});
