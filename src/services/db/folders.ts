import { DatabaseType, db } from './index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

enum FolderKeys {
  ALL = 'folders',
  TOP_LEVEL = 'folders/top-level',
  DETAIL = 'folders/detail',
}

// Database functions
async function getAllTopLevelFolders(database: DatabaseType) {
  const query = `
    SELECT 
        f1.id AS folder_id,
        f1.name AS folder_name,
        f2.id AS child_folder_id,
        f2.name AS child_folder_name,
        fc.entry_id AS child_entry_id
    FROM folders f1
    LEFT JOIN folders f2 ON f2.parent_id = f1.id  -- Join to get subfolders
    LEFT JOIN folder_contents fc ON fc.folder_id = f1.id  -- Join to get entries inside the folder
    WHERE f1.parent_id IS NULL;  -- Only select top-level folders
  `;

  return await database?.select(query);
}

async function getFolders(database: DatabaseType) {
  return await database?.select('SELECT * FROM folders');
}

async function getFolderById(database: DatabaseType, folderId: number) {
  return await database?.select('SELECT * FROM folders WHERE id = ?', [folderId]);
}

async function createFolder(database: DatabaseType, name: string, parentId: number | null = null) {
  return await database?.execute('INSERT INTO folders (name, parent_id) VALUES (?, ?)', [
    name,
    parentId,
  ]);
}

async function updateFolder(database: DatabaseType, folderId: number, newName: string) {
  return await database?.execute('UPDATE folders SET name = ? WHERE id = ?', [newName, folderId]);
}

async function deleteFolder(database: DatabaseType, folderId: number) {
  return await database?.execute('DELETE FROM folders WHERE id = ?', [folderId]);
}

// React Query Hooks
export function useTopLevelFolders() {
  return useQuery({
    queryKey: [FolderKeys.TOP_LEVEL],
    queryFn: () => getAllTopLevelFolders(db.getDb() as DatabaseType),
  });
}

export function useFolders() {
  return useQuery({
    queryKey: [FolderKeys.ALL],
    queryFn: () => getFolders(db.getDb() as DatabaseType),
  });
}

export function useFolder(folderId: number) {
  return useQuery({
    queryKey: [FolderKeys.DETAIL, folderId],
    queryFn: () => getFolderById(db.getDb() as DatabaseType, folderId),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: number | null }) =>
      createFolder(db.getDb() as DatabaseType, name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FolderKeys.ALL] });
      queryClient.invalidateQueries({ queryKey: [FolderKeys.TOP_LEVEL] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, newName }: { folderId: number; newName: string }) =>
      updateFolder(db.getDb() as DatabaseType, folderId, newName),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: [FolderKeys.ALL] });
      queryClient.invalidateQueries({ queryKey: [FolderKeys.DETAIL, folderId] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: number) => deleteFolder(db.getDb() as DatabaseType, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FolderKeys.ALL] });
      queryClient.invalidateQueries({ queryKey: [FolderKeys.TOP_LEVEL] });
    },
  });
}
