import { useGetAllDeletedNotes } from '@/services/db/notes';

import { MiniNoteRenderer } from './MiniNoteRenderer';

export const TrashScene = () => {
  const { data: deletedNotes, isLoading } = useGetAllDeletedNotes();

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
            <div className="w-full h-64 border border-stone-200 rounded-lg flex flex-col gap-2 overflow-hidden">
              <div className="flex flex-col gap-2 overflow-hidden px-2">
                <MiniNoteRenderer id={note.id} content={note.content} />
              </div>
            </div>
            <p className="text-stone-500">{note.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
