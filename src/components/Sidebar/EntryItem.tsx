import { FC } from 'react';

import { EllipsisIcon, ScrollTextIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Note } from '@/services/db/types';

import { TileType, addTile } from '../Header/header.store';

interface EntryItemProps {
  note: Note;
}

export const EntryItem: FC<EntryItemProps> = ({ note }) => {
  const navigate = useNavigate();

  return (
    <div
      className="text-start p-1 rounded-xl cursor-pointer hover:bg-stone-200 flex items-center gap-2 w-full group"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/notes/${note.id}`);
        addTile({
          id: note.id,
          title: note.title,
          type: TileType.NOTE,
        });
      }}
    >
      <span className="flex items-center justify-center">
        <ScrollTextIcon size={16} strokeWidth={2} className="text-stone-500 dark:text-stone-200" />
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
