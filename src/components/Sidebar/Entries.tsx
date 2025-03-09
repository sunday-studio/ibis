import { EntryItem } from '@/components/Sidebar/EntryItem';
import { Folder } from '@/components/Sidebar/Folder';

import {
  useCreateNote,
  useGetAllActiveNotes,
  useGetAllArchivedNotes,
  useGetAllPinnedNotes,
} from '@/services/db/notes';

export const Entries = () => {
  const { data: activeNotes, isLoading: isNotesLoading } = useGetAllActiveNotes();
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const { data: archivedNotes } = useGetAllArchivedNotes();

  const { mutate: createNote } = useCreateNote();

  // const handleCreateNote = async () => {
  //   createNote({
  //     title: 'Untitled',
  //     content: null,
  //     isPinned: 0,
  //     isDuplicate: 0,
  //     tagsId: null,
  //     isLocked: 0,
  //     isArchived: 0,
  //   });
  // };

  return (
    <div className="flex flex-col gap-2 w-full h-full mt-4" data-tauri-drag-region>
      <div className="px-4 flex flex-col gap-2" data-tauri-drag-region>
        {isNotesLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-2">
            <Folder
              name="Pinned"
              emptyStateText="No pinned files yet"
              items={pinnedNotes}
              renderItem={(item) => <EntryItem key={item.id} note={item} />}
              defaultOpen
            />

            <Folder
              name="Active"
              emptyStateText="No active files yet"
              items={activeNotes}
              renderItem={(item) => <EntryItem key={item.id} note={item} />}
            />

            <Folder
              name="Archived"
              emptyStateText="No archived notes yet"
              items={archivedNotes}
              renderItem={(item) => <EntryItem key={item.id} note={item} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};
