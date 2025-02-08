import {
  BadgeInfo,
  Columns,
  CornerUpRight,
  Copy,
  Package,
  StarIcon,
  Trash2,
  EllipsisIcon,
  Link,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGetAllPinnedNotes } from '@/services/db/notes';
import { DropdownMenu } from '@/components/DropdownMenu';

export const NoteActionsMenu = () => {
  const { data: pinnedNotes } = useGetAllPinnedNotes();
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const pinnedNotesIds = pinnedNotes?.map((note) => note.id);

  const options = useMemo(() => {
    return [
      {
        title: 'Favorite',
        action: () => {},
        icon: <StarIcon size={16} />,
      },

      {
        title: 'Duplicate',
        action: () => {},
        icon: <Copy size={16} />,
      },

      {
        title: 'Move to',
        action: () => {},
        icon: <CornerUpRight size={16} />,
      },

      {
        title: 'Archive',
        action: () => {},
        icon: <Package size={16} />,
      },

      {
        title: isDoubleClicked ? 'Click again to delete' : 'Delete',
        action: (e) => {
          e.preventDefault();
          e.stopPropagation();
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
  );
};
