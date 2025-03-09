import { FC } from 'react';

import clsx from 'clsx';
import { EllipsisIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import { EmojiRenderer } from '@/features/notes/NoteIconPicker';
import { Note } from '@/services/db/types';

import { TileType, addTile } from '../Header/header.store';

interface EntryItemProps {
  note: Note;
}

export const EntryItem: FC<EntryItemProps> = ({ note }) => {
  const navigate = useNavigate();

  const isActive = useLocation().pathname === `/notes/${note.id}`;

  return (
    <div
      className={clsx(
        'text-start p-1 pl-2 rounded-xl cursor-pointer hover:bg-stone-200 flex items-center gap-2 w-full group',
        {
          'bg-stone-200 dark:bg-stone-800 hover:ring-2 hover:ring-inset hover:ring-stone-300 dark:hover:ring-stone-700':
            isActive,
        },
      )}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/notes/${note.id}`);
        addTile({
          id: note.id,
          title: note.title,
          type: TileType.NOTE,
          icon: note.icon,
        });
      }}
    >
      <span className="flex items-center justify-center">
        <EmojiRenderer emoji={note.icon} size={14} />
      </span>
      <p className="font-medium text-neutral-600 dark:text-stone-200">{note.title || 'Untitled'}</p>

      <div
        className="flex items-center justify-center ml-auto rounded-lg opacity-0 group-hover:opacity-100 hover:bg-stone-300 dark:hover:bg-stone-800 p-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EllipsisIcon size={16} strokeWidth={2} className="text-stone-400 dark:text-stone-200" />
      </div>
    </div>
  );
};
