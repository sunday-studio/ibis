import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';
import { useGetNote, useUpdateNote } from '@/services/db/notes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { NoteActionsMenu } from './NoteActionsMenu';
import { PinVerification } from '@/components/PinVerification';
// import { PinVerification } from '@/components/PinVerification';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const { data, isLoading } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote();
  const [isPinVerificationOpen, setIsPinVerificationOpen] = useState<boolean>(
    data?.isLocked || true,
  );

  const [isLocked, setIsLocked] = useState<boolean>(data?.isLocked || true);

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full p-4 relative px-20">
      <div className="flex absolute top-0 right-0 w-full justify-between items-center p-2 px-4">
        <p>Syncing</p>
        <p>{headerTitle}</p>

        <NoteActionsMenu
          note={data}
          onLock={() => {
            // if (data?.isLocked) {
            //   setIsPinVerificationOpen(true);
            // } else {
            //   setIsLocked(true);
            // }
          }}
        />
      </div>

      {isPinVerificationOpen && (
        <PinVerification
          title="This note is locked"
          description="Enter your PIN to view this note"
          onSubmit={(pin) => {
            setIsPinVerificationOpen(false);
          }}
        />
      )}

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
