import { Trash2, Undo2Icon } from 'lucide-react';

import { Button } from '@/components/Button';

import { useGetAllDeletedNotes, useHardDeleteNote, useRestoreNote } from '@/services/db/notes';

import { MiniNoteRenderer } from './MiniNoteRenderer';

export const TrashScene = () => {
  const { data: deletedNotes, isLoading } = useGetAllDeletedNotes();
  const { mutate: restoreNote } = useRestoreNote();
  const { mutate: hardDeleteNote } = useHardDeleteNote();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (deletedNotes?.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-stone-500">No deleted notes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-12 mb-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Trash</h1>
      </div>

      <div className="grid grid-cols-4 gap-y-6 gap-x-2">
        {deletedNotes?.map((note) => (
          <div className="flex flex-col gap-1 cursor-pointer" key={note.id}>
            <div className="w-full h-64 border border-stone-200 rounded-lg flex flex-col gap-2 overflow-hidden group">
              <div className="flex flex-col gap-2 overflow-hidden px-2 h-full w-full relative">
                <MiniNoteRenderer id={note.id} content={note.content} />
                <div className="w-full absolute gap-2 inset-0 h-full bg-neutral-300/50 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                  <Button
                    variant="unstyled"
                    className="p-2 m-0 rounded-full bg-green-200 dark:bg-green-600 w-12 h-12 hover:bg-green-300 dark:hover:bg-green-700"
                    onPress={() => {
                      restoreNote(note.id);
                    }}
                  >
                    <Undo2Icon size={16} className="text-green-500" />
                  </Button>

                  <Button
                    variant="unstyled"
                    className="p-2 m-0 rounded-full bg-red-200 dark:bg-red-600 w-12 h-12 hover:bg-red-300 dark:hover:bg-red-700"
                    onPress={() => {
                      hardDeleteNote(note.id);
                    }}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-stone-500">{note.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
