import { useState } from 'react';

export const PinInput = ({ onSubmit }: { onSubmit: (pin: string) => void }) => {
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

  const handleSubmit = () => {
    const fullPin = pin.join('');
    if (fullPin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    onSubmit(fullPin);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`#pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        {pin.map((digit, index) => (
          <input
            key={index}
            id={`pin-${index}`}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center border-2 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
