import { DatabaseType, db } from './index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Note } from './types';
import { useInvalidateQueries } from '@/lib/use-rq';

enum NoteKeys {
  ALL = 'notes',
  DETAIL = 'notes/detail',
  ALL_PINNED_NOTES = 'notes/pinned',
  ALL_ARCHIVED_NOTES = 'notes/archived',
  DETAIL_ARCHIVED_STATUS = 'notes/archived/status',
}

async function getActiveNotes(database: DatabaseType) {
  return (await database?.select(`
    SELECT * FROM entries 
    WHERE id NOT IN (
      SELECT entry_id 
      FROM bin 
      WHERE restoredAt IS NULL
    )
    AND isPinned = 0
    AND isArchived = 0
  `)) as Note[];
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
  const notes = (await database?.select('SELECT * FROM entries WHERE id = ?', [noteId])) as Note[];
  return notes?.[0];
}

async function pinNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isPinned = 1 WHERE id = ?', [noteId]);
}

async function unpinNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isPinned = 0 WHERE id = ?', [noteId]);
}

async function deleteNote(database: DatabaseType, noteId: string) {
  return await database?.execute('DELETE FROM entries WHERE id = ?', [noteId]);
}

async function updateNote(database: DatabaseType, noteId: string, params: Partial<Note>) {
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

async function archiveNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isArchived = 1 WHERE id = ?', [noteId]);
}

async function unarchiveNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isArchived = 0 WHERE id = ?', [noteId]);
}

async function getAllArchivedNotes(database: DatabaseType) {
  return (await database?.select(`
    SELECT * FROM entries e 
    WHERE e.isArchived = 1 
    AND e.id NOT IN (SELECT entry_id FROM bin)
  `)) as Note[];
}

async function getAllPinnedNotes(database: DatabaseType) {
  return (await database?.select(
    'SELECT * FROM entries WHERE isPinned = 1 AND isArchived = 0',
  )) as Note[];
}

export function useGetAllActiveNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL],
    queryFn: () => getActiveNotes(db.getDb()),
  });
}

export function useCreateNote() {
  return useMutation({
    mutationFn: (params: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) =>
      createNote(db.getDb(), params),
    onSuccess: () => {
      useInvalidateQueries([NoteKeys.ALL]);
    },
  });
}

export function usePinNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL,
    NoteKeys.ALL_PINNED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => pinNote(db.getDb(), noteId),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}
export function useUnpinNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL,
    NoteKeys.ALL_PINNED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => unpinNote(db.getDb(), noteId),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useUpdateNote() {
  const invalidateQueries = useInvalidateQueries([NoteKeys.ALL]);

  return useMutation({
    mutationFn: ({ id, entry }: { id: string; entry: Partial<Note> }) =>
      updateNote(db.getDb(), id, entry),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useDeleteNote() {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL,
    NoteKeys.ALL_ARCHIVED_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
  ]);

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(db.getDb(), noteId),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useGetNote({ noteId }: { noteId: string }) {
  return useQuery({
    queryKey: [`${NoteKeys.DETAIL}/${noteId}`],
    queryFn: () => {
      return getNote(db.getDb(), noteId);
    },
  });
}

export function useGetAllPinnedNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL_PINNED_NOTES],
    queryFn: () => getAllPinnedNotes(db.getDb()),
  });
}

export function useUnarchiveNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL,
    NoteKeys.ALL_PINNED_NOTES,
    NoteKeys.ALL_ARCHIVED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => unarchiveNote(db.getDb(), noteId),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useArchiveNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL,
    NoteKeys.ALL_ARCHIVED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => archiveNote(db.getDb(), noteId),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useGetAllArchivedNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL_ARCHIVED_NOTES],
    queryFn: () => getAllArchivedNotes(db.getDb()),
  });
}
