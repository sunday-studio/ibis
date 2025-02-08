import { useTopLevelFolders } from '@/services/db/folders';
import {
  useCreateNote,
  useGetAllActiveNotes,
  useGetAllArchivedNotes,
  useGetAllPinnedNotes,
} from '@/services/db/notes';
import { NavLink } from 'react-router';

export const NotesSidebarMenu = () => {
  const { data: topLevelFolders } = useTopLevelFolders();
  const { data: activeNotes, isLoading: isNotesLoading } = useGetAllActiveNotes();
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const { data: archivedNotes } = useGetAllArchivedNotes();

  const { mutate: createNote } = useCreateNote();

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled',
      content: null,
      isPinned: false,
      isDuplicate: false,
      isArchived: false,
      tagsId: null,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full  h-full">
      <div className="p-4">
        {isNotesLoading && <p>Loading...</p>}

        <div className="flex flex-col gap-2 mb-8 ">
          <p className="text-sm font-medium pb-2">Pinned</p>
          {pinnedNotes?.map((note) => (
            <NavLink
              to={`/notes/${note.id}`}
              key={note.id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              {note.title}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-sm font-medium pb-2">Notes</p>
          {activeNotes?.map((note) => (
            <NavLink
              to={`/notes/${note.id}`}
              key={note.id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              {note.title}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-sm font-medium pb-2">Archived</p>
          {archivedNotes?.map((note) => (
            <NavLink
              to={`/notes/${note.id}`}
              key={note.id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              {note.title}
            </NavLink>
          ))}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 mt-8 w-full p-4">
        <p className="text-sm font-medium pb-2">Folders</p>
        {topLevelFolders?.map((folder) => (
          <div key={folder.folder_id} className="w-full">
            {folder.folder_name}
          </div>
        ))}
      </div> */}

      <div className="border-t border-gray-200 w-full mt-auto">
        <button onClick={handleCreateNote} className="w-full p-2">
          New entry
        </button>
      </div>
    </div>
  );
};
