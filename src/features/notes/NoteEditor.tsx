import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';
import { useGetNote, useUpdateNote } from '@/services/db/notes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { NoteActionsMenu } from './NoteActionsMenu';
import { PinVerification } from '@/components/PinVerification';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const { data, isLoading } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote({ noteId: noteId as string });

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
    <div className="flex flex-col w-full min-h-screen relative">
      <div className="flex sticky top-0 w-full flex-col z-1 px-10 py-2 bg-white dark:bg-stone-950 border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
          </div>
          <p>{headerTitle}</p>
          <NoteActionsMenu note={data} />
        </div>
        <div className="bottom-mask absolute bottom-0 left-0 w-full h-20"></div>
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
        <div className="flex flex-col w-full h-full mt-24 px-20">
          <input
            value={title ?? data?.title ?? 'Untitled'}
            className="mb-6 font-semibold text-4xl text-gray-800 outline-none editor-title dark:text-stone-100"
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
