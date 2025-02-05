import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';
import { useGetNote, useUpdateNote } from '@/services/db/notes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { EllipsisIcon } from 'lucide-react';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const { data } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote();

  const [title, setTitle] = useState(data?.title);

  const updateTitle = useDebouncedCallback((title: string) => {
    if (!data) return;

    updateNote({
      id: data.id,
      entry: {
        title,
      },
    });
  }, 500);

  if (!data) return null;

  const headerTitle = title ?? data.title;

  return (
    <div className="flex flex-col w-full h-full p-4 relative px-20">
      <div className="flex debug absolute top-0 right-0 w-full justify-between items-center p-2">
        <p>Syncing</p>
        <p>{headerTitle}</p>
        <button>
          <EllipsisIcon />
        </button>
      </div>

      {data && (
        <div className="flex flex-col w-full h-full mt-24">
          <input
            value={title ?? data?.title ?? 'Untitled'}
            className="mb-4 font-semibold text-2xl text-gray-700 outline-none"
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              updateTitle(value);
            }}
          />
          <Editor
            id={noteId ?? ''}
            content={getEditorContent(data?.content ?? '')}
            onChange={(content) => {
              updateNote({
                id: data.id,
                entry: {
                  // ...data,
                  content,
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
