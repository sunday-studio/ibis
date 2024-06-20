import { logger } from '@/lib/logger';
import { MigrationReturnType } from '.';
import { getNewId } from './file-json-to-md.migrate';

/**
 * This function iterates through the values of the index.json file and migrate the ids to new standard ie without the date string included
 * SCHEMA_VERSION: 0.2
 */

export const removeDateStringsFromIndex = async ({
  data,
  updatedVersion,
  indexFile,
}): Promise<MigrationReturnType> => {
  try {
    const { fileContent, ...rest } = indexFile;
    const fileFolders = fileContent?.folders ?? {};

    const deletedEntries = fileContent.deletedEntries.map((entryId: string) => getNewId(entryId));
    const pinnedEntries = fileContent.pinnedEntries.map((entry) => {
      if (typeof entry === 'object') {
        return entry?.id && getNewId(entry.id);
      }
      return getNewId(entry);
    });

    const updatedFolders = Object.entries(fileFolders).map(([key, value]) => {
      const folderValue = {
        // @ts-ignore
        ...value,
        // @ts-ignore
        entries: value?.entries?.map((e) => getNewId(e)),
      };

      return [key, folderValue];
    });

    const folders = Object.fromEntries(updatedFolders);

    const updatedIndexFileContent = {
      ...fileContent,
      schemaVersion: updatedVersion,
      deletedEntries,
      pinnedEntries,
      folders,
    };

    return {
      indexFile: {
        ...rest,
        fileContent: updatedIndexFileContent,
      },
      data,
    };
  } catch (error) {
    logger.error('removeDateStringFromIndex', error);
  }
};
