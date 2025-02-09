import { Button } from './Button';
import { Modal, ModalProps } from './Modal';
import { FC } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput } from './Input';
import { PinInput } from './PinInput';
import { Label } from './Field';

interface CreateUserModalProps extends ModalProps {
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  pin: z.string().min(4),
});

const formId = 'create-user-form';

type FormSchema = z.infer<typeof formSchema>;

export const CreateUserModal: FC<CreateUserModalProps> = ({ onClose }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <Modal
      isOpen
      title="Create User"
      footerActions={
        <Button type="submit" form={formId}>
          Create
        </Button>
      }
      onClose={onClose}
    >
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInput label="Name" {...field} errorMessage={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput label="Email" {...field} errorMessage={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="pin"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label>PIN</Label>
              <PinInput onSubmit={field.onChange} />
            </div>
          )}
        />
      </form>
    </Modal>
  );
};
