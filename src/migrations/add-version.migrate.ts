import { invoke } from '@tauri-apps/api/tauri';

/*
This function updates the version in the index.json file
*/
export const addVersionToFileSystem = async ({ updatedVersion = 0.0, indexFile }) => {
  console.log(`migration: add ${updatedVersion} version to index.json`);

  const {
    content: { deletedEntries = [], pinnedEntries = [] },
    url,
  } = indexFile;

  const updatedIndexFileContent = {
    schemaVersion: updatedVersion,
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
