import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

import { migrateFileSystem } from '@/migrations';
import { Entry, Folder, entriesStore } from '@/store/entries';
import { journalEntryState } from '@/store/journal-state';
import { tagsState } from '@/store/tags-state';

import { searchEngine } from '../search/search-engine';
import { DocumentType, meili } from './syncing-engine';

// pattern year-month-day; 2023-01-12
const DATE_PATTERN = 'y-MM-dd';

type EntryType = {
  type: DocumentType.Entry;
  data: Pick<Entry, 'createdAt' | 'id' | 'content'>;
};

type JournalEntryType = {
  type: DocumentType.Journal;
  data: { date: string; content: string };
};

type TagsType = {
  type: DocumentType.Tags;
  data: Record<string, { value: string; label: string }>;
};

type IndexType = {
  type: DocumentType.Index;
  data: {
    deletedEntries: string[];
    pinnedEntries: string[];
    schemaVersion: number;
    folders: Record<string, Folder>;
  };
};

type SaveFileToDiskProps = EntryType | JournalEntryType | TagsType | IndexType;

type DeleteFileFromDiskProps = {
  type?: DocumentType;
  data: Entry;
};

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const syncAllTodaysToDisk = async () => {
  const journalEntries = Object.entries(journalEntryState.journalEntries);

  const entriesToSync = journalEntries.map(([date, entry]) => {
    return {
      dateString: date,
      content: entry,
    };
  });

  try {
    await meili.bulkSavingToFile(entriesToSync, generateTodayPath);
  } catch (error) {
    console.error(error);
    toast.error("Don't fret, not your fault, sending the issue over to god");
  }
};

export const syncAllEntriesToDisk = async () => {
  const itemsToSync = entriesStore.privateEntries.map((entry) => {
    return {
      dateString: entry.createdAt,
      content: entry,
    };
  });

  try {
    await meili.bulkSavingToFile(itemsToSync, generateEntryPath);
  } catch (error) {
    console.error(error);
    toast.error("Don't fret, not your fault, sending the issue over to god");
  }
};

const getFileType = (url: string, baseURL: string) => {
  const cleanedurl = url.replace(baseURL, '').toLowerCase();

  if (cleanedurl.includes('today')) {
    return 'journalNotes';
  }

  if (cleanedurl.includes('highlight')) {
    return 'highlights';
  }

  if (months.some((month) => cleanedurl.includes(month.toLowerCase()))) {
    return 'entries';
  }
  const splitURL = cleanedurl.split('/');

  return cleanedurl.split('/')[splitURL.length - 1];
};

export const loadDirectoryContent = async (safeURL: string) => {
  const flatEntries = await meili.readDirectoryContent(safeURL);

  const promises = flatEntries.map(async (file: string) => {
    return {
      type: getFileType(file, safeURL),
      url: file,
      fileContent: await meili.readFileContent(file),
    };
  });

  const content = await Promise.all(promises);

  const { migratedData, indexFile } = await migrateFileSystem(content);

  const groupedData = migratedData.reduce((acc, obj) => {
    if (!acc[obj.type]) {
      acc[obj.type] = [];
    }
    acc[obj.type].push(obj);
    return acc;
  }, {});

  // load data into localStores
  try {
    entriesStore.loadLocalData({
      entries: groupedData.entries,
      index: indexFile,
    });
    journalEntryState.localLocalData(groupedData.journalNotes);
    tagsState.loadLocalData(groupedData['tags.json']?.[0]);
    searchEngine.loadLocalData(groupedData.entries, groupedData.journalNotes);
  } catch (error) {
    console.log('error =>', error);
  }
};

/**
 * @deprecated
 */
export const generateEntryPath = (
  dateString: string,
  basePath: string,
): [string, string, string] => {
  // Convert the provided dateString to a JavaScript Date object.

  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();
  const month = format(date, 'LLL');

  // Generate a unique filename based on the date and time.
  const filename = `${format(date, DATE_PATTERN)}.${nanoid()}.md`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/${month}`;

  const path = `${dirPath}/${filename}`;

  return [dirPath, filename, path];
};

/**
 * @deprecated
 */
export const generateTodayPath = (dateString: string, basePath: string): [string, string] => {
  // Convert the provided dateString to a JavaScript Date object.
  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();

  const filename = `${format(date, DATE_PATTERN)}.md`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/Today`;

  return [dirPath, filename];
};

/**
 * @deprecated
 */
const generateTagsPath = (_: any, basePath: string): [string, string] => {
  return [basePath, 'tags.json'];
};

/**
 * @deprecated
 */
const generateIndexPath = (_: any, basePath: string): [string, string] => {
  return [basePath, 'index.json'];
};

export const saveFileToDisk = async (props: SaveFileToDiskProps) => {
  const { type, data } = props;

  try {
    switch (type) {
      case DocumentType.Entry:
        await meili.writeFileContentToDisk({
          dateString: data?.createdAt,
          type: DocumentType.Entry,
          id: data?.id,
          content: data?.content ?? '',
        });
        break;

      case DocumentType.Journal:
        await meili.writeFileContentToDisk({
          dateString: data?.date,
          content: data?.content,
          type: DocumentType.Journal,
        });

        break;

      case DocumentType.Index:
        await meili.writeFileContentToDisk({
          dateString: '',
          content: JSON.stringify(data),
          type: DocumentType.Index,
        });
        break;

      case DocumentType.Tags:
        await meili.writeFileContentToDisk({
          dateString: '',
          content: data,
          type: DocumentType.Tags,
        });
    }
  } catch (error) {
    console.log('error =>', error);
  }
};

export const deleteFileFromDisk = async (props: DeleteFileFromDiskProps) => {
  await meili.deletefile({
    type: DocumentType.Entry,
    dateString: props.data.createdAt,
    id: props.data.id,
  });
};
