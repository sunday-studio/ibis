import { useTopLevelFolders } from '@/services/db/folders';

export const Sidebar = () => {
  const { data: topLevelFolders } = useTopLevelFolders();

  return (
    <div>
      <p>Sidebar</p>
    </div>
  );
};
