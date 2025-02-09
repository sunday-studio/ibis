import { Button } from './Button';
import { Modal, ModalProps } from './Modal';
import { FC, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput } from './Input';
import { PinInput } from './PinInput';
import { Label } from './Field';
import { useCreateUser } from '@/services/db/user';
import { useClipboard } from 'react-aria';
import { toast } from 'sonner';

interface CreateUserModalProps
  extends Omit<ModalProps, 'isOpen' | 'title' | 'showCloseButton' | 'footerActions'> {
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  pin: z.string().min(4),
});

const formId = 'create-user-form';

type FormSchema = z.infer<typeof formSchema>;

interface RecoveryTokenProps {
  recoveryToken: string;
}

const RecoveryToken: FC<RecoveryTokenProps> = ({ recoveryToken }) => {
  const { clipboardProps } = useClipboard({
    getItems() {
      return [
        {
          'text/plain': recoveryToken,
        },
      ];
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <p>
        This is your recovery token. You need it to recover your PIN. We will never show it again so
        save it in a safe place.
      </p>

      <div className="flex flex-col gap-2 p-2.5 border border-neutral-200 rounded-lg bg-neutral-100">
        <code className="text-sm font-serif text-gray-600 break-all">{recoveryToken}</code>
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          onPress={(e) => {
            clipboardProps.onFocus?.(e as any);
            toast.success('Recovery token copied to clipboard');
          }}
        >
          Copy
        </Button>
      </div>
    </div>
  );
};

export const CreateUserModal: FC<CreateUserModalProps> = ({ onClose }) => {
  const { mutate: createUser, isPending } = useCreateUser();
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    createUser(data, {
      onSuccess: (data) => {
        setRecoveryToken(data);
      },
      onError: (error) => {
        toast.error('Failed to create user, please try again', {
          description: error.message,
        });
      },
    });
  };

  return (
    <Modal
      isOpen
      title={recoveryToken ? 'Recovery Token' : 'Create User'}
      showCloseButton={!recoveryToken}
      footerActions={
        <Button type="submit" form={formId} isLoading={isPending}>
          {recoveryToken ? 'Close' : 'Create'}
        </Button>
      }
      onClose={onClose}
    >
      {recoveryToken ? (
        <RecoveryToken recoveryToken={recoveryToken} />
      ) : (
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput label="Name" {...field} {...fieldState} />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput label="Email" {...field} {...fieldState} />
            )}
          />
          <Controller
            control={form.control}
            name="pin"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Label>PIN</Label>
                <PinInput onSubmit={field.onChange} errorMessage={fieldState.error?.message} />
              </div>
            )}
          />
        </form>
      )}
    </Modal>
  );
};
