import { FC, useState } from 'react';

import { Button } from '@/components/Button';
import { TextInput } from '@/components/Input';
import { Modal, type SubModalProps } from '@/components/Modal';

import { useCreateFolder } from '@/services/db/folders';

interface CreateFolderModalProps extends SubModalProps {
  onSubmit: () => void;
}

export const CreateFolderModal: FC<CreateFolderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const { mutate: createFolder } = useCreateFolder();

  const handleSubmit = () => {
    createFolder({ name });
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Folder"
      footerActions={<Button onPress={handleSubmit}>Create</Button>}
    >
      <TextInput label="Name" value={name} onChange={setName} />
    </Modal>
  );
};
