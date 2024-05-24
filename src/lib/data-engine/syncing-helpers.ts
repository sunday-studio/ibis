import { format } from 'date-fns';
import { toast } from 'sonner';

import { migrateFileSystem } from '@/migrations';
import { DailyEntry, dailyEntryState } from '@/store/daily-state';
import { Entry, entriesStore } from '@/store/entries';
import { tagsState } from '@/store/tags-state';

import { meili } from './syncing-engine';

// pattern year-month-day; 2023-01-12
const DATE_PATTERN = 'y-MM-dd';

type EntryType = {
  type: 'entry';
  data: Entry;
};

type DailyEntryType = {
  type: 'today';
  data: DailyEntry;
};

type TagsType = {
  type: 'tags';
  data: Record<string, { value: string; label: string }>;
};

type IndexType = {
  type: 'index';
  data: {
    deletedEntries: string[];
    pinnedEntries: string[];
  };
};

type SaveFileToDiskProps = EntryType | DailyEntryType | TagsType | IndexType;

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
  const dailyEntries = Object.entries(dailyEntryState.dailyEntries);

  const entriesToSync = dailyEntries.map(([date, entry]) => {
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
    return 'dailyNotes';
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

  // always run migrations
  // when there's no migration done, the same data as content is returned
  const migratedData = await migrateFileSystem(content);

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
      index: groupedData['index.json']?.[0],
    });
    dailyEntryState.localLocalData(groupedData.dailyNotes);
    tagsState.loadLocalData(groupedData['tags.json']?.[0]);
  } catch (error) {
    console.log('error =>', error);
  }
};

const generateEntryPath = (dateString: string, basePath: string): [string, string, string] => {
  // Convert the provided dateString to a JavaScript Date object.

  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();
  const month = format(date, 'LLL');

  // Generate a unique filename based on the date and time.
  const filename = `${format(date, DATE_PATTERN)}.${format(date, 't')}.md`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/${month}`;

  const path = `${dirPath}/${filename}`;

  return [dirPath, filename, path];
};

const generateTodayPath = (dateString: string, basePath: string): [string, string] => {
  // Convert the provided dateString to a JavaScript Date object.
  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();

  const filename = `${format(date, DATE_PATTERN)}.md`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/Today`;

  return [dirPath, filename];
};

const generateTagsPath = (_: any, basePath: string): [string, string] => {
  return [basePath, 'tags.json'];
};

const generateIndexPath = (_: any, basePath: string): [string, string] => {
  return [basePath, 'index.json'];
};

export const saveFileToDisk = async (props: SaveFileToDiskProps) => {
  const { type, data } = props;

  // console.log('data =>', data);

  // return;

  switch (type) {
    case 'entry':
      try {
        await meili.writeFileContentToDisk(data?.createdAt, data?.content, generateEntryPath);
      } catch (error) {
        // TODO: fix instances of this.basePath being null
        console.log('error =>', error);
      }
      break;

    case 'today':
      await meili.writeFileContentToDisk(data?.date, data.content, generateTodayPath);
      break;

    case 'tags':
      await meili.writeFileContentToDisk('', data, generateTagsPath);
      break;

    case 'index':
      await meili.writeFileContentToDisk('', data, generateIndexPath);

    default:
      break;
  }
};

export const deleteFile = async (entry: Entry) => {
  const [_, _s, path] = generateEntryPath(entry.createdAt, meili.basePath);

  await meili.deletefile(path);
};
