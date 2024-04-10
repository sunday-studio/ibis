import { invoke } from '@tauri-apps/api/tauri';

/*
This function updates the version in the index.json file
*/
export const addVersionToFileSystem = async ({ updatedVersion = 0.0, data }) => {
  let indexFile = data?.find((item) => item?.type === 'index.json');
  indexFile['version'] = updatedVersion;

  console.log({ indexFile });

  try {
    await invoke('write_to_file', {
      path: indexFile?.url,
      content: JSON.stringify(indexFile, null, 2),
    });
  } catch (error) {
    console.log('error >', error);
  }

  // console.log('addVersionToFileSystem =>', indexFile);
};
