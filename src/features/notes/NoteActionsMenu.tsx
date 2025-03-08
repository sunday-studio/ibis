import { FC, useMemo, useState } from 'react';

import { formatRelative } from 'date-fns';
import { Copy, EllipsisIcon, KeySquareIcon, Lock, Package, StarIcon, Trash2 } from 'lucide-react';

import { DropdownMenu, useDropdownMenuToggle } from '@/components/DropdownMenu';

import {
  useArchiveNote,
  useDeleteNote,
  useGetAllPinnedNotes,
  useLockNote,
  usePinNote,
  useUnarchiveNote,
  useUnlockNote,
  useUnpinNote,
} from '@/services/db/notes';
import { Note } from '@/services/db/types';

interface NoteActionsMenuProps {
  note: Note;
}

export const NoteActionsMenu: FC<NoteActionsMenuProps> = ({ note }) => {
  const { mutate: pinNote } = usePinNote(note.id);
  const { mutate: unpinNote } = useUnpinNote(note.id);
  const { mutate: archiveNote } = useArchiveNote(note.id);
  const { mutate: unarchiveNote } = useUnarchiveNote(note.id);
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const { mutate: lockNote } = useLockNote(note.id);
  const { mutate: unlockNote } = useUnlockNote(note.id);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const { mutate: deleteNote } = useDeleteNote();

  const { isOpen, setIsOpen } = useDropdownMenuToggle();

  const pinnedNotesIds = pinnedNotes?.map((note) => note.id);

  const defaultIconColor = 'currentColor';

  const options = useMemo(() => {
    return [
      {
        title: note.isPinned ? 'Unpin' : 'Pin',
        action: () => {
          note.isPinned ? unpinNote() : pinNote();
        },
        icon: (
          <StarIcon
            size={16}
            color={note.isPinned ? 'var(--color-orange-600)' : defaultIconColor}
            fill={note.isPinned ? 'var(--color-orange-600)' : 'none'}
          />
        ),
      },

      {
        title: note.isArchived ? 'Unarchive' : 'Archive',
        action: () => {
          note.isArchived ? unarchiveNote() : archiveNote();
        },
        icon: (
          <Package
            size={16}
            color={note.isArchived ? 'var(--color-neutral-600)' : defaultIconColor}
          />
        ),
      },

      {
        title: note.isLocked ? 'Unlock' : 'Lock',
        action: () => {
          note.isLocked ? unlockNote() : lockNote();
        },
        icon: note.isLocked ? <KeySquareIcon size={16} /> : <Lock size={16} />,
      },

      {
        title: 'Duplicate',
        action: () => {},
        icon: <Copy size={16} />,
      },

      {
        title: isDoubleClicked ? 'Click again to delete' : 'Delete',
        action: () => {
          deleteNote(note.id);
          // if (isDoubleClicked) {
          //   // /  deleteNote({ id: noteId });
          // } else {
          //   setIsDoubleClicked(true);
          // }
        },
        // isDoubleClicked ? entriesStore.deleteEntry(entry.id) : setIsDoubleClicked(true),
        icon: <Trash2 size={16} />,
        disabled: false,
        active: isDoubleClicked,
        isDestructive: true,
      },
    ];
  }, [pinnedNotesIds, isDoubleClicked]);

  return (
    <>
      <DropdownMenu isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>
          <EllipsisIcon className="text-stone-600 dark:text-stone-400" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.MenuContent>
            {options.map((option) => (
              <DropdownMenu.Item key={option.title} {...option}>
                {option.title}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.MenuContent>
          <DropdownMenu.Separator />
          <div className="py-3 px-4 text-sm flex flex-col gap-1.5 text-stone-400 dark:text-stone-400 font-medium">
            <p className="flex items-center gap-2">
              <span>Word count:</span>
              <span>1332</span>
            </p>
            <p className="flex items-center gap-2">
              <span>Character count:</span>
              <span>1332</span>
            </p>
            <p className="flex items-center gap-2">
              <span>{formatRelative(new Date(note.updatedAt || note.createdAt), new Date())}</span>
            </p>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
