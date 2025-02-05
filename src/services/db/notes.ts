import { DatabaseType, db } from './index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Entry } from './types';

enum NoteKeys {
  ALL = 'notes',
  DETAIL = 'notes/detail',
}

async function getNotes(database: DatabaseType) {
  return (await database?.select('SELECT * FROM entries')) as Entry[];
}

async function createNote(
  database: DatabaseType,
  params: {
    title: string;
    content: string | null;
    isPinned: boolean;
    isDuplicate: boolean;
    tagsId: string | null;
  },
) {
  return await database?.execute(
    'INSERT INTO entries (title, content, isPinned, isDuplicate, tagsId) VALUES (?, ?, ?, ?, ?)',
    [params.title, params.content, params.isPinned, params.isDuplicate, params.tagsId],
  );
}

async function getNote(database: DatabaseType, noteId: string) {
  const notes = (await database?.select('SELECT * FROM entries WHERE id = ?', [noteId])) as Entry[];
  return notes?.[0];
}

async function archiveNote(database: DatabaseType, noteId: number) {
  return await database?.execute('UPDATE entries SET isArchived = 1 WHERE id = ?', [noteId]);
}

async function pinNote(database: DatabaseType, noteId: number) {
  return await database?.execute('UPDATE entries SET isPinned = 1 WHERE id = ?', [noteId]);
}

async function unpinNote(database: DatabaseType, noteId: number) {
  return await database?.execute('UPDATE entries SET isPinned = 0 WHERE id = ?', [noteId]);
}

async function deleteNote(database: DatabaseType, noteId: number) {
  return await database?.execute('DELETE FROM entries WHERE id = ?', [noteId]);
}

async function updateNote(database: DatabaseType, noteId: number, params: Partial<Entry>) {
  try {
    const entries = Object.entries(params);
    if (entries.length === 0) return;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);

    return await database?.execute(`UPDATE entries SET ${setClause} WHERE id = ?`, [
      ...values,
      noteId,
    ]);
  } catch (error) {
    console.log('error =>', error);
  }
}

export function useNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL],
    queryFn: () => getNotes(db.getDb() as DatabaseType),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) =>
      createNote(db.getDb() as DatabaseType, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function useArchiveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => archiveNote(db.getDb() as DatabaseType, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function usePinNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => pinNote(db.getDb() as DatabaseType, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function useUnpinNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => unpinNote(db.getDb() as DatabaseType, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, entry }: { id: number; entry: Partial<Entry> }) =>
      updateNote(db.getDb() as DatabaseType, id, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => deleteNote(db.getDb() as DatabaseType, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NoteKeys.ALL] });
    },
  });
}

export function useGetNote({ noteId }: { noteId: string }) {
  return useQuery({
    queryKey: [`${NoteKeys.DETAIL}/${noteId}`],
    queryFn: () => {
      return getNote(db.getDb() as DatabaseType, noteId);
    },
  });
}
