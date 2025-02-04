import { Editor } from '@/components/editor/Editor';
import { useGetNote, useUpdateNote } from '@/services/db/notes';
import { useParams } from 'react-router';

export const NoteEditor = () => {
  const { noteId } = useParams();
  const { data } = useGetNote({ noteId: noteId as string });
  const { mutate: updateNote } = useUpdateNote();

  console.log({ data });

  return (
    <div className="flex flex-col w-full h-full p-4">
      {data && (
        <Editor
          id={noteId ?? ''}
          content={data?.content ?? null}
          onChange={(content) => {
            updateNote({
              id: data.id,
              entry: {
                ...data,
                content,
              },
            });
          }}
        />
      )}
    </div>
  );
};
