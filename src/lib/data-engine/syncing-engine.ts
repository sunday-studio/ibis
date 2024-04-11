import { invoke } from '@tauri-apps/api';
import { createDir } from '@tauri-apps/api/fs';

import { SAFE_LOCATION_KEY } from '../constants';
import { getData } from '../storage';

type Data = {
  dateString: string;
  content: any;
};

type DirFunction = (dateString: string, basePath: string) => [string, string, string?];

const file_exist = async (path: string) => await invoke('path_exists', { path });

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
    if (!this.basePath) {
      const url = getData(SAFE_LOCATION_KEY);
      this.basePath = url;
    }

    const [dirPath, filename] = dirFn?.(dateString, this.basePath);

    // Check if the directory already exists on disk.
    const directoryExist = await file_exist(dirPath);

    // If the directory doesn't exist, create it (including any missing parent directories).
    if (!directoryExist) {
      await createDir(dirPath, { recursive: true });
    }

    // Write the JSON content to a file in the specified directory.
    await invoke('write_to_file', {
      path: `${dirPath}/${filename}`,
      content: JSON.stringify(content),
    });
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
      const data = await invoke<{ files: any }>('get_all_files', {
        path: url,
      });
      return data?.files;
    } catch (error) {
      console.log('error ->', error);
    }
  }

  async readFileContent(url: string) {
    try {
      const content = await invoke<string>('read_file_content', {
        path: url,
      });

      return JSON.parse(content);
    } catch (error) {
      console.error('unable to read file content =>', error);
    }
  }

  async deletefile(path: string) {
    try {
      await invoke('delete_file', { path });
    } catch (error) {
      console.log('deleting-file ->', error);
    }
  }

  async renameFile(oldPath: string, newPath: string) {
    try {
      await invoke('rename_file', {
        oldPath,
        newPath,
      });
    } catch (error) {
      console.error('trying to rename =>', error);
    }
  }
}

export const meili = new Meili();
