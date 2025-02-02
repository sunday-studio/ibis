import { CreateFolderModal } from '@/features/folders/CreateFolderModal';
import { useModal } from '@/hooks/useModal';
import { useTopLevelFolders } from '@/services/db/folders';
import { Button } from 'react-aria-components';

export const Sidebar = () => {
  const { data: topLevelFolders } = useTopLevelFolders();
  const { isModalOpen, handleShow, handleHide } = useModal();

  return (
    <div>
      {topLevelFolders?.map((folder) => (
        <p key={folder.folder_id}>{folder.folder_name}</p>
      ))}
      <Button onPress={handleShow}>Create Folder</Button>
      <CreateFolderModal isOpen={isModalOpen} onClose={handleHide} onSubmit={handleHide} />
    </div>
  );
};
