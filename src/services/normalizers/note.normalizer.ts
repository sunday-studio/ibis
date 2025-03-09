import { Note } from '../db/types';

export const normalizeNote = (note: Note) => {
  return {
    ...note,
    isLocked: Boolean(note.isLocked),
    isPinned: Boolean(note.isPinned),
    isArchived: Boolean(note.isArchived),
    isDuplicate: Boolean(note.isDuplicate),
    isFullWidth: Boolean(note.isFullWidth),
  };
};
