import { useState } from 'react';

import { ValidationResult } from 'react-aria-components';

import { FieldError, Input } from './Field';
import { inputStyles } from './Input';
import { composeTailwindRenderProps } from './utils';

interface PinInputProps {
  onSubmit: (pin: string) => void;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const PinInput = ({ onSubmit, errorMessage }: PinInputProps) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    setError('');
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input or submit if last digit
    if (value) {
      if (index < 3) {
        const nextInput = document.querySelector<HTMLInputElement>(`#pin-${index + 1}`);
        nextInput?.focus();
      } else {
        // Auto submit when 4th digit is entered
        const fullPin = [...newPin.slice(0, 3), value].join('');
        if (fullPin.length === 4) {
          onSubmit(fullPin);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`#pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-2">
        {pin.map((digit, index) => (
          <Input
            key={index}
            id={`pin-${index}`}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={composeTailwindRenderProps(inputStyles, 'w-12 h-12 text-center')}
          />
        ))}
      </div>
      {errorMessage && <FieldError>{error}</FieldError>}
    </div>
  );
};
