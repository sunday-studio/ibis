import { invoke } from '@tauri-apps/api/tauri';

/*
This function updates the version in the index.json file
*/
export const addVersionToFileSystem = async ({ updatedVersion = 0.0, data }) => {
  console.log('migration: add updatedVersion to index.json');

  const {
    content: { deletedEntries = [], pinnedEntries = [] },
    url,
  } = data?.find((item) => item?.type === 'index.json');

  const updatedIndexFileContent = {
    version: updatedVersion,
    deletedEntries,
    pinnedEntries,
  };

  try {
    await invoke('write_to_file', {
      path: url,
      content: JSON.stringify(updatedIndexFileContent),
    });
  } catch (error) {
    console.log('error >', error);
  }
};
