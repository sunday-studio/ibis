export type Folder = {
  folder_id: number;
  name: string;
  parent_id?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string | null;
  isPinned: boolean;
  isDuplicate: boolean;
  createdAt: string;
  updatedAt: string;
  tagsId: string | null;
  isArchived: boolean;
  isLocked: boolean;
  isFullWidth: boolean;
};

export type CreateNoteType = {
  title: string;
  content: string | null;
  tagsId: string | null;
  isArchived: number;
  isDuplicate: number;
  isPinned: number;
  isLocked: number;
};

export type ArchivedEntry = {
  entry_id: number;
  archivedAt: string;
};

export type FolderContent = {
  id: number;
  folder_id: number;
  entry_id: number | null;
  subfolder_id: number | null;
  createdAt: string;
};

export type BinItem = {
  id: number;
  entry_id: number | null;
  folder_id: number | null;
  deletedAt: string;
  restoredAt: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  recoveryToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Preference = {
  id: number;
  userId: number;
  appearance: string;
};

export type NoteHistoryEntry = {
  id: string;
  entry_id: string;
  title: string;
  content: string;
  createdAt?: string;
};

export type CreateNoteHistoryEntry = Omit<NoteHistoryEntry, 'id'>;
