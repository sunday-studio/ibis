import { DatabaseType, db } from './index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateNoteType, Note, CreateNoteHistoryEntry, NoteHistoryEntry } from './types';
import { useInvalidateQueries, rq } from '@/lib/use-rq';
import { normalizeNote } from '@/services/normalizers/note.normalizer';
import { toast } from 'sonner';

enum NoteKeys {
  ALL_ACTIVE_NOTES = 'notes/active',
  DETAIL = 'notes/detail',
  ALL_PINNED_NOTES = 'notes/pinned',
  ALL_ARCHIVED_NOTES = 'notes/archived',
  DETAIL_ARCHIVED_STATUS = 'notes/archived/status',
  NOTE_HISTORY = 'notes/history',
  NOTE_HISTORY_DETAIL = 'notes/history',
}

export async function getAll(database: DatabaseType) {
  return (await database?.select(`
    SELECT * FROM entries
  `)) as Note[];
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

async function createNote(database: DatabaseType, params: CreateNoteType) {
  return await database?.execute(
    'INSERT INTO entries (title, content, isPinned, isDuplicate, tagsId) VALUES (?, ?, ?, ?, ?)',
    [params.title, params.content, params.isPinned, params.isDuplicate, params.tagsId],
  );
}

async function getNote(database: DatabaseType, noteId: string) {
  const notes = (await database?.select('SELECT * FROM entries WHERE id = ?', [noteId])) as Note[];

  if (notes.length === 0) {
    throw new Error('Note not found');
  }

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

async function lockNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isLocked = 1 WHERE id = ?', [noteId]);
}

async function unlockNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isLocked = 0 WHERE id = ?', [noteId]);
}

async function archiveNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isArchived = 1 WHERE id = ?', [noteId]);
}

async function unarchiveNote(database: DatabaseType, noteId: string) {
  return await database?.execute('UPDATE entries SET isArchived = 0 WHERE id = ?', [noteId]);
}

async function createNoteHistory(database: DatabaseType, history: CreateNoteHistoryEntry) {
  const { entry_id, title, content } = history;

  return await database?.execute(
    'INSERT INTO entries_history (entry_id, title, content) VALUES (?, ?, ?)',
    [entry_id, title, content],
  );
}

async function getNoteHistory(database: DatabaseType, noteId: string) {
  return (await database?.select('SELECT * FROM entries_history WHERE entry_id = ?', [
    noteId,
  ])) as NoteHistoryEntry[];
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
    queryKey: [NoteKeys.ALL_ACTIVE_NOTES],
    queryFn: async () => {
      return rq(() => getActiveNotes(db.getDb()));
    },
  });
}

export function useCreateNote() {
  const invalidateQueries = useInvalidateQueries([NoteKeys.ALL_ACTIVE_NOTES]);
  return useMutation({
    mutationFn: (params: CreateNoteType) => rq(() => createNote(db.getDb(), params)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function usePinNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => rq(() => pinNote(db.getDb(), noteId)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useUnpinNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => rq(() => unpinNote(db.getDb(), noteId)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useUpdateNote({ noteId }: { noteId: string }) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
    NoteKeys.ALL_ARCHIVED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: ({ id, entry }: { id: string; entry: Partial<Note> }) =>
      rq(() => updateNote(db.getDb(), id, entry)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useDeleteNote() {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_ARCHIVED_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
  ]);

  return useMutation({
    mutationFn: (noteId: string) => rq(() => deleteNote(db.getDb(), noteId)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useGetNote({ noteId }: { noteId: string }) {
  return useQuery({
    queryKey: [`${NoteKeys.DETAIL}/${noteId}`],
    queryFn: async () => {
      const note = await rq(() => getNote(db.getDb(), noteId));
      return normalizeNote(note);
    },
  });
}

export function useGetAllPinnedNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL_PINNED_NOTES],
    queryFn: () => rq(() => getAllPinnedNotes(db.getDb())),
  });
}

export function useUnarchiveNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_PINNED_NOTES,
    NoteKeys.ALL_ARCHIVED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => rq(() => unarchiveNote(db.getDb(), noteId)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useArchiveNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([
    NoteKeys.ALL_ACTIVE_NOTES,
    NoteKeys.ALL_ARCHIVED_NOTES,
    `${NoteKeys.DETAIL}/${noteId}`,
  ]);

  return useMutation({
    mutationFn: () => rq(() => archiveNote(db.getDb(), noteId)),
    onSuccess: () => {
      invalidateQueries();
    },
  });
}

export function useGetAllArchivedNotes() {
  return useQuery({
    queryKey: [NoteKeys.ALL_ARCHIVED_NOTES],
    queryFn: () => rq(() => getAllArchivedNotes(db.getDb())),
  });
}

export function useLockNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([`${NoteKeys.DETAIL}/${noteId}`]);

  return useMutation({
    mutationFn: () => rq(() => lockNote(db.getDb(), noteId)),
    onSuccess: () => {
      toast.success('Note locked');
      invalidateQueries();
    },
  });
}

export function useUnlockNote(noteId: string) {
  const invalidateQueries = useInvalidateQueries([`${NoteKeys.DETAIL}/${noteId}`]);

  return useMutation({
    mutationFn: () => rq(() => unlockNote(db.getDb(), noteId)),
    onSuccess: () => {
      toast.success('Note unlocked');
      invalidateQueries();
    },
  });
}

export function useCreateNoteHistory() {
  return useMutation({
    mutationFn: (history: CreateNoteHistoryEntry) =>
      rq(() => createNoteHistory(db.getDb(), history)),
    onError: (error) => {
      console.log('error =>', error);
    },
    onSuccess: () => {
      console.log('success');
    },
  });
}

export function useGetNoteHistory(noteId: string) {
  return useQuery({
    queryKey: [`${NoteKeys.NOTE_HISTORY}/${noteId}`],
    queryFn: () => rq(() => getNoteHistory(db.getDb(), noteId)),
  });
}
