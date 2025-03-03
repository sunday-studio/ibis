import { useState } from 'react';

import { PanelRight } from 'lucide-react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { useSnapshot } from 'valtio';

import { PinVerification } from '@/components/PinVerification';
import { Tooltip } from '@/components/Tooltip';
import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';

import { toggleSidebarState } from '@/app.store';
import { sidebarState } from '@/app.store';
import {
  useCreateNoteHistory,
  useGetNote,
  // useGetNoteHistory,
  useUpdateNote,
} from '@/services/db/notes';

import { NoteActionsMenu } from './NoteActionsMenu';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;
  const { data, isLoading } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote({ noteId: noteId as string });
  // const { data: history, isLoading: historyLoading } = useGetNoteHistory(noteId as string);
  const { mutate: createNoteHistory } = useCreateNoteHistory();

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
      <div className="z-1 top-0 right-0 mx-4 my-2 fixed">
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
        <div className="flex flex-col h-full mt-24 w-2/3 mx-auto">
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
            onHistoryChange={(state) => {
              createNoteHistory({
                entry_id: data.id,
                title: data.title,
                content: state,
              });
            }}
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
