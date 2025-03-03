import { FC } from 'react';

import { toast } from 'sonner';

import { useGetUser, useVerifyUserPin } from '@/services/db/user';

import { CreateUserModal } from './CreateUserModal';
import { PinInput } from './PinInput';

interface PinVerificationProps {
  onSubmit: (fullPin: string) => void;
  title: string;
  description: string;
  onClose: () => void;
}

interface PinCreationProps {
  onSubmit: (fullPin: string) => void;
}

const PinOverlay: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute inset-0 backdrop-blur-lg z-50 flex items-center justify-center w-full h-full overflow-hidden">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg flex flex-col ring-1 ring-neutral-100 w-[300px] items-center">
        {children}
      </div>
    </div>
  );
};

export const PinVerification: FC<PinVerificationProps> = ({
  onSubmit,
  title,
  description,
  onClose,
}) => {
  const { mutate: verifyPin } = useVerifyUserPin();
  const { data: user } = useGetUser();

  if (!user) {
    return <CreateUserModal onClose={onClose} />;
  }

  return (
    <PinOverlay>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <PinInput
        onSubmit={(pin) => {
          verifyPin(
            { pin, userId: user.id.toString() },
            {
              onSuccess: () => {
                onSubmit(pin);
              },
              onError: (error) => {
                toast.error('Invalid PIN');
              },
            },
          );
        }}
      />
    </PinOverlay>
  );
};

export const PinCreation: FC<PinCreationProps> = ({ onSubmit }) => {
  return (
    <PinOverlay>
      <h2 className="text-xl font-semibold mb-4">Create PIN</h2>
      <PinInput onSubmit={onSubmit} />
    </PinOverlay>
  );
};
