import { useTopLevelFolders } from '@/services/db/folders';

export const NotesSidebarMenu = () => {
  const { data: topLevelFolders } = useTopLevelFolders();

  console.log(topLevelFolders);
  return (
    <div className="flex flex-col gap-2 w-full">
      <p>Journal</p>

      <div className="flex flex-col gap-2 border mt-8 w-full">
        <p className="text-sm font-medium pb-2">Folders</p>
        {topLevelFolders?.map((folder) => (
          <div key={folder.folder_id} className="w-full">
            {folder.folder_name}
          </div>
        ))}
      </div>
    </div>
  );
};
