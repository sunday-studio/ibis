import { FC } from 'react';
import { PinInput } from './PinInput';

interface PinVerificationProps {
  onSubmit: (fullPin: string) => void;
  title: string;
  description: string;
}

export const PinVerification: FC<PinVerificationProps> = ({ onSubmit, title, description }) => {
  return (
    <div className="absolute inset-0 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg flex flex-col ring-1 ring-neutral-100 w-[300px] items-center">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <PinInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};
