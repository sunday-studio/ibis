import { invoke } from '@tauri-apps/api';
import { createDir, exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

import { SAFE_LOCATION_KEY } from '../constants';
import { getData } from '../storage';

type Data = {
  dateString: string;
  content: any;
};

type DirFunction = (dateString: string, basePath: string) => [string, string];

/**
 * this is the main sync service to save files changes on device and in the future in the cloud
 */
class Meili {
  basePath = '';

  constructor() {
    const data = getData(SAFE_LOCATION_KEY);
    this.basePath = data;
    // this.basePath = data?.user?.user_metadata?.safeDirectory;
  }

  /**
   * This async function takes a date string and some content as parameters
   * and writes the content to a JSON file on disk, organizing the file based on the date.
   */
  async writeFileContentToDisk(dateString: string, content: any, dirFn: DirFunction) {
    const [dirPath, filename] = dirFn?.(dateString, this.basePath);

    // Check if the directory already exists on disk.
    const directoryExist = await exists(dirPath);

    // If the directory doesn't exist, create it (including any missing parent directories).
    if (!directoryExist) {
      await createDir(dirPath, { recursive: true });
    }

    // Write the JSON content to a file in the specified directory.
    await writeTextFile(`${dirPath}/${filename}`, JSON.stringify(content));
  }

  /**
   * This async function takes an array of data objects and performs bulk saving of each data object
   * by calling the writeFileContentToDisk function for each element in the array.
   */
  async bulkSavingToFile(data: Array<Data>, dirFn: DirFunction) {
    // Iterate through each element (Data object) in the data array.
    data.forEach((element: Data) => {
      // Call the writeFileContentToDisk function for each element, passing the date string and content.
      this.writeFileContentToDisk(element.dateString, element.content, dirFn);
    });
  }

  async readDirectoryContent(url = this.basePath) {
    try {
      // TODO: ignore all hidden files. safe guide for git files
      const data = await invoke('get_all_files', {
        path: url,
      });
      // @ts-ignore
      return data?.files;
    } catch (error) {
      console.log('error ->', error);
    }
  }

  async readFileContent(url: string) {
    try {
      const content = await readTextFile(url);
      return JSON.parse(content);
    } catch (error) {}
  }
}

export const meili = new Meili();
