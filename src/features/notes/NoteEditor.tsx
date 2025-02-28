import { Editor } from '@/components/editor/Editor';
import { getEditorContent } from '@/components/editor/utils';
import { useGetNote, useUpdateNote } from '@/services/db/notes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { NoteActionsMenu } from './NoteActionsMenu';
import { PinVerification } from '@/components/PinVerification';
import { Tooltip } from '@/components/Tooltip';
import { PanelRight } from 'lucide-react';
import { toggleSidebarState } from '@/app.store';
import { useSnapshot } from 'valtio';
import { sidebarState } from '@/app.store';
import { AnimatePresence, motion } from 'motion/react';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;
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
      <div className="flex sticky top-0 w-full flex-col z-1">
        <div
          className="flex justify-between items-center bg-white dark:bg-stone-950 px-20 py-2"
          data-tauri-drag-region
        >
          <div className="flex items-center gap-2" data-tauri-drag-region>
            {!isSidebarOpen && (
              <Tooltip
                key="sidebar-toggle"
                leaveDuration={0}
                hoverDuration={300}
                trigger={
                  <button
                    className="flex items-center hover:bg-stone-100 rounded-lg p-2"
                    onClick={() => toggleSidebarState()}
                  >
                    <PanelRight size={18} />
                  </button>
                }
                content="Open in sidebar"
              />
            )}

            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
          </div>
          <p>{headerTitle}</p>
          <NoteActionsMenu note={data} />
        </div>
        <div className="note-header" data-tauri-drag-region />
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
