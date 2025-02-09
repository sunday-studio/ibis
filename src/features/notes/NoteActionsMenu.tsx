import {
  Columns,
  CornerUpRight,
  Copy,
  Package,
  StarIcon,
  Trash2,
  EllipsisIcon,
  Link,
  Lock,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  // useDeleteNote,
  useArchiveNote,
  useGetAllPinnedNotes,
  usePinNote,
  useUnpinNote,
  useUnarchiveNote,
} from '@/services/db/notes';
import { DropdownMenu } from '@/components/DropdownMenu';
import { Note } from '@/services/db/types';

interface NoteActionsMenuProps {
  note: Note;
  onLock: () => void;
}

export const NoteActionsMenu = ({ note, onLock }: NoteActionsMenuProps) => {
  const { mutate: pinNote } = usePinNote(note.id);
  const { mutate: unpinNote } = useUnpinNote(note.id);
  const { mutate: archiveNote } = useArchiveNote(note.id);
  const { mutate: unarchiveNote } = useUnarchiveNote(note.id);
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const pinnedNotesIds = pinnedNotes?.map((note) => note.id);

  const defaultIconColor = 'var(--color-neutral-800)';

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
        title: 'Lock',
        action: () => {
          onLock();
        },
        icon: <Lock size={16} />,
      },

      {
        title: 'Duplicate',
        action: () => {},
        icon: <Copy size={16} />,
      },

      {
        title: isDoubleClicked ? 'Click again to delete' : 'Delete',
        action: () => {
          if (isDoubleClicked) {
            // /  deleteNote({ id: noteId });
          } else {
            setIsDoubleClicked(true);
          }
        },
        // isDoubleClicked ? entriesStore.deleteEntry(entry.id) : setIsDoubleClicked(true),
        icon: <Trash2 size={16} />,
        disabled: false,
        active: isDoubleClicked,
      },

      {
        title: 'Move to',
        action: () => {},
        icon: <CornerUpRight size={16} />,
        disabled: true,
      },

      {
        title: 'Open in split view',
        action: () => {},
        icon: <Columns size={16} />,
        disabled: true,
      },

      {
        title: 'Share',
        action: () => {},
        icon: <Link size={16} />,
        disabled: true,
      },
    ];
  }, [pinnedNotesIds, isDoubleClicked]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <EllipsisIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {options.map((option) => (
            <DropdownMenu.Item key={option.title} {...option}>
              {option.title}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
