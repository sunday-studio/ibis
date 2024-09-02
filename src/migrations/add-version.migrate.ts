import { invoke } from '@tauri-apps/api/tauri';

import { MigrationReturnType } from '.';

/**
 * This function updates the version in the index.json file
 * SCHEMA_VERSION: 0
 */
export const addVersionToFileSystem = async ({
  updatedVersion = 0.0,
  indexFile,
}): Promise<MigrationReturnType> => {
  const { url = '', fileContent } = indexFile;

  const updatedIndexFileContent = {
    ...fileContent,
    schemaVersion: updatedVersion,
  };

  try {
    await invoke('write_to_file', {
      path: url,
      content: JSON.stringify(updatedIndexFileContent),
    });
  } catch (error) {
    console.log('error ==>', error);
  }

  return {} as MigrationReturnType;
};
