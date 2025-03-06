import { Button } from '@/components/Button';

import { useCreateNote } from '@/services/db/notes';

export const NotesEmptyState = () => {
  const { mutate: createNote } = useCreateNote();

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled',
      content: null,
      isPinned: 0,
      isDuplicate: 0,
      tagsId: null,
      isLocked: 0,
      isArchived: 0,
    });
  };

  return (
    <div className="flex w-full h-full items-center justify-center flex-col gap-4">
      <p className="text-gray-600 dark:text-gray-300">Select a note or create a new one</p>
      <Button variant="secondary" size="small" onPress={handleCreateNote}>
        Start writing
      </Button>
    </div>
  );
};
