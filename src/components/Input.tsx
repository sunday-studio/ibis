import { forwardRef } from 'react';
import { clsx } from 'clsx';
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { fieldBorderStyles, FieldError, FieldTextarea, Input, Label } from './Field';
import { composeTailwindRenderProps, focusRing } from './utils.ts';

export const inputStyles = tv({
  extend: focusRing,
  base: 'border-neutral-200 focus-visible:ring-4 border-2 rounded-xl outline-transparent hover:border-neutral-300 transition',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants,
  },
});

export interface TextInputProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, description, errorMessage, placeholder, ...props }, ref) => {
    return (
      <AriaTextField
        {...props}
        className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1')}
      >
        {label && (
          <Label
            className={clsx({
              'mb-0.5': !description,
            })}
          >
            {label}
          </Label>
        )}
        {description && <p className="text-xs text-text-secondary mb-2">{description}</p>}
        <Input ref={ref} className={inputStyles} placeholder={placeholder} />
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ label, description, errorMessage, placeholder, ...props }, ref) => {
    return (
      <AriaTextField
        {...props}
        className={composeTailwindRenderProps(props.className, 'flex flex-col')}
      >
        {label && (
          <Label
            className={clsx({
              'mb-0.5': !description,
            })}
          >
            {label}
          </Label>
        )}
        {description && <p className="text-xs text-text-secondary mb-2">{description}</p>}
        <FieldTextarea ref={ref} className={inputStyles} placeholder={placeholder} />
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  },
);
