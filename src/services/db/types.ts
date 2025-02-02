export type Folder = {
  folder_id: number;
  folder_name: string;
  child_folder_id: number | null;
  child_folder_name: string | null;
  child_entry_id: number | null;
};
