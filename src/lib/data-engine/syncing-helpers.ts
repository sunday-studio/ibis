import { DailyEntry, dailyEntryState } from '@/store/daily-state';
import { Entry, entriesStore } from '@/store/entries';
import { tagsState } from '@/store/tags-state';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { meili } from './syncing-engine';

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
  data: TagsType;
};

type SaveFileToDiskProps = EntryType | DailyEntryType | TagsType;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      content: await meili.readFileContent(file),
    };
  });

  const content = await Promise.all(promises);

  const groupedData = content.reduce((acc, obj) => {
    if (!acc[obj.type]) {
      acc[obj.type] = [];
    }

    acc[obj.type].push(obj);
    return acc;
  });

  // load data into localStores
  try {
    entriesStore.loadLocalData(groupedData.entries);
    dailyEntryState.localLocalData(groupedData.dailyNotes);
    tagsState.loadLocalData(groupedData['tags.json']?.[0]);
  } catch (error) {
    console.log('error =>', error);
  }
};

const generateEntryPath = (dateString: string, basePath: string): [string, string] => {
  // Convert the provided dateString to a JavaScript Date object.
  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();
  const month = format(date, 'LLL');

  // Generate a unique filename based on the date and time.
  const filename = `${format(date, 'uqqdd')}-${format(date, 't')}.json`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/${month}`;

  return [dirPath, filename];
};

const generateTodayPath = (dateString: string, basePath: string): [string, string] => {
  // Convert the provided dateString to a JavaScript Date object.
  const date = new Date(dateString);

  // Extract the year and month from the date.
  const year = date.getFullYear().toString();

  const filename = `${format(date, 'uqqdd')}.json`;

  // Construct the directory path where the file will be saved.
  const dirPath = `${basePath}/${year}/Today`;

  return [dirPath, filename];
};

const generateTagsPath = (_: any, basePath: string): [string, string] => {
  return [basePath, 'tags.json'];
};

export const saveFileToDisk = async (props: SaveFileToDiskProps) => {
  const { type, data } = props;

  switch (type) {
    case 'entry':
      try {
        await meili.writeFileContentToDisk(data?.createdAt, data, generateEntryPath);
      } catch (error) {
        // TODO: fix instances of this.basePath being null
        console.log('error =>', error);
      }
      break;

    case 'today':
      await meili.writeFileContentToDisk(data?.date, data, generateTodayPath);
      break;

    case 'tags':
      await meili.writeFileContentToDisk('', data, generateTagsPath);
      break;

    default:
      break;
  }
};
