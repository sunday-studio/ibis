import clsx from 'clsx';
import { NavLink } from 'react-router';

import {
  useCreateNote,
  useGetAllActiveNotes,
  useGetAllArchivedNotes,
  useGetAllPinnedNotes,
} from '@/services/db/notes';
import { Note } from '@/services/db/types';

const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <p className="text-sm font-medium text-gray-500 pb-2 italic">{text}</p>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  emptyStateText: string;
  showEmptyState?: boolean;
}

const Section = ({ title, children, emptyStateText, showEmptyState }: SectionProps) => {
  return (
    <div className="flex flex-col mt-4">
      <p className="font-medium pb-2.5 pl-1">{title}</p>
      <div className="flex flex-col">{children}</div>
      {showEmptyState && <EmptyState text={emptyStateText} />}
    </div>
  );
};

const NoteItem = ({ note }: { note: Note }) => {
  return (
    <NavLink
      to={`/notes/${note.id}`}
      className={({ isActive }) =>
        clsx('hover:bg-gray-100 p-1 rounded-md cursor-pointer hover:ring-1 hover:ring-gray-200', {
          'text-orange-500': isActive,
        })
      }
    >
      {note.title}
    </NavLink>
  );
};

export const NotesSidebarMenu = () => {
  const { data: activeNotes, isLoading: isNotesLoading } = useGetAllActiveNotes();
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const { data: archivedNotes } = useGetAllArchivedNotes();

  const { mutate: createNote } = useCreateNote();

  const handleCreateNote = async () => {
    createNote({
      title: 'Untitled',
      content: null,
      isPinned: 0,
      isDuplicate: 0,
      tagsId: null,
      isLocked: 0,
      isArchived: 0,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full" data-tauri-drag-region>
      <div className="px-4 flex flex-col gap-2" data-tauri-drag-region>
        {isNotesLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Section
              title="Pinned"
              emptyStateText="No pinned notes yet"
              showEmptyState={pinnedNotes?.length === 0}
            >
              {pinnedNotes?.map((note) => <NoteItem key={note.id} note={note} />)}
            </Section>

            <Section
              title="Notes"
              emptyStateText="No notes yet"
              showEmptyState={activeNotes?.length === 0}
            >
              {activeNotes?.map((note) => <NoteItem key={note.id} note={note} />)}
            </Section>

            <Section
              title="Archived"
              emptyStateText="No archived notes yet"
              showEmptyState={archivedNotes?.length === 0}
            >
              {archivedNotes?.map((note) => <NoteItem key={note.id} note={note} />)}
            </Section>
          </>
        )}
      </div>

      {/* <div className="flex flex-col gap-2 mt-8 w-full p-4">
        <p className="text-sm font-medium pb-2">Folders</p>
        {topLevelFolders?.map((folder) => (
          <div key={folder.folder_id} className="w-full">
            {folder.folder_name}
          </div>
        ))}
      </div> */}

      <div className="border-t border-gray-100 w-full mt-auto">
        <button
          onClick={() => {
            handleCreateNote();
          }}
          className="w-full p-2 cursor-pointer"
        >
          New entry
        </button>
      </div>
    </div>
  );
};
