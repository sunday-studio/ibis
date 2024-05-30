import { invoke } from '@tauri-apps/api';
import { createDir } from '@tauri-apps/api/fs';
import { format } from 'date-fns';
import * as gm from 'gray-matter';
import { nanoid } from 'nanoid';

import { DATE_PATTERN, SAFE_LOCATION_KEY } from '../constants';
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
  }

  async writeFileContentToDisk({
    dateString,
    content,
    type,
    id,
  }: {
    dateString: string;
    content: string | {};
    type: DocumentType;
    id?: string;
  }) {
    if (!this.basePath) {
      const url = getData(SAFE_LOCATION_KEY);
      this.basePath = url;
    }

    const { path, directoryPath } = pathGenerator.generatePath({ dateString, type, id });

    console.log({ path, directoryPath });

    const directoryExist = await file_exist(directoryPath);

    if (!directoryExist) {
      await createDir(directoryPath, { recursive: true });
    }

    await invoke('write_to_file', {
      path,
      content: content,
    });
  }

  async bulkSavingToFile(data: Array<Data>, dirFn: DirFunction) {
    // data.forEach((element: Data) => {
    //   this.writeFileContentToDisk(element.dateString, element.content, dirFn);
    // });
  }

  async readDirectoryContent(url = this.basePath) {
    try {
      const data = await invoke<{ files: any }>('get_all_files', {
        path: url,
      });
      return data?.files;
    } catch (error) {
      // console.log('error ->', error);
    }
  }

  async readFileContent(url: string) {
    try {
      const content = await invoke<string>('read_file_content', {
        path: url,
      });

      // edge case for when user has .json files
      if (url.includes('.json')) {
        return JSON.parse(content);
      }

      const markdown = gm(content);

      return {
        markdown: markdown?.content,
        data: markdown?.data,
      };
    } catch (error) {
      console.log('readFileContent =>', { error, message: error.message, url });
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

type PathReturn = {
  directoryPath: string;
  filename: string;
  path: string;
};

export enum DocumentType {
  Entry,
  Journal,
  Index,
  Tags,
}

class PathGenerator {
  basePath: string = '';

  constructor() {
    const data = getData(SAFE_LOCATION_KEY);
    this.basePath = data;
  }

  private generateEntryPath(dateString: string, id?: string): PathReturn {
    const date = new Date(dateString);
    const entryId = id ?? nanoid();

    const monthAndYear = format(date, 'yyyy/LLL');
    const filename = `${format(date, DATE_PATTERN)}.${entryId}.md `;

    const directoryPath = `${this.basePath}/${monthAndYear}`;

    return {
      directoryPath,
      filename,
      path: `${directoryPath}/${filename}`,
    };
  }

  private generateJournalPath(dateString: string): PathReturn {
    const date = new Date(dateString);
    const year = format(date, 'yyyy');

    const filename = `${format(date, DATE_PATTERN)}.md`;
    const directoryPath = `${this.basePath}/${year}/today`;

    return {
      directoryPath,
      filename,
      path: `${directoryPath}/${filename}`,
    };
  }

  generatePath({
    dateString,
    id,
    type,
  }: {
    type: DocumentType;
    dateString: string;
    id?: string;
  }): PathReturn {
    switch (type) {
      case DocumentType.Entry:
        return this.generateEntryPath(dateString, id);

      case DocumentType.Journal:
        return this.generateJournalPath(dateString);

      case DocumentType.Index:
        return {
          path: `${this.basePath}/index.json`,
          filename: 'index.json',
          directoryPath: this.basePath,
        };

      case DocumentType.Tags:
        return {
          path: `${this.basePath}/tags.json`,
          filename: 'tags.json',
          directoryPath: this.basePath,
        };

      default:
        throw new Error(`Unable to find document type => ${type}`);
    }
  }
}

export const meili = new Meili();
export const pathGenerator = new PathGenerator();
