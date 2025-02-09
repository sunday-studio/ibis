import { FC } from 'react';
import { PinInput } from './PinInput';
import { useGetUser, useVerifyUserPin } from '@/services/db/user';
import { CreateUserModal } from './CreateUserModal';
import { toast } from 'sonner';

interface PinVerificationProps {
  onSubmit: (fullPin: string) => void;
  title: string;
  description: string;
  onClose: () => void;
}

interface PinCreationProps {
  onSubmit: (fullPin: string) => void;
}

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
    <div className="absolute inset-0 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg flex flex-col ring-1 ring-neutral-100 w-[300px] items-center">
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
      </div>
    </div>
  );
};

export const PinCreation: FC<PinCreationProps> = ({ onSubmit }) => {
  return (
    <div className="absolute inset-0 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg flex flex-col ring-1 ring-neutral-100 w-[300px] items-center">
        <h2 className="text-xl font-semibold mb-4">Create PIN</h2>
        <PinInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};
