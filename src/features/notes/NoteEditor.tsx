import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';
import { useDeleteNote, useGetNote, useUpdateNote } from '@/services/db/notes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { NoteActionsMenu } from './NoteActionsMenu';
import { PinVerification } from '@/components/PinVerification';
import { useDeleteUser } from '@/services/db/user';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const { data, isLoading } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteUser } = useDeleteUser();

  const [isPinVerificationOpen, setIsPinVerificationOpen] = useState<boolean | undefined>(
    data?.isLocked,
  );

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

  const showPinVerification =
    isPinVerificationOpen === undefined ? data.isLocked : isPinVerificationOpen;

  return (
    <div className="flex flex-col w-full h-full p-4 relative px-20">
      <div className="flex absolute top-0 right-0 w-full justify-between items-center p-2 px-4">
        <p>Syncing</p>
        <p>{headerTitle}</p>

        <NoteActionsMenu note={data} />
      </div>

      {showPinVerification && (
        <PinVerification
          title="This note is locked"
          description="Enter your PIN to view this note"
          onSubmit={() => {
            setIsPinVerificationOpen(false);
          }}
          onClose={() => {
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
