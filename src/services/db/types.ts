export type Folder = {
  folder_id: number;
  folder_name: string;
  child_folder_id: number | null;
  child_folder_name: string | null;
  child_entry_id: number | null;
};

export type Entry = {
  id: number;
  title: string;
  content: string | null;
  isPinned: boolean;
  isDuplicate: boolean;
  createdAt: string;
  updatedAt: string;
  tagsId: string | null;
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
