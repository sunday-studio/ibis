import { dailyEntryState } from '@/store/daily-state';
import { entriesStore } from '@/store/entries';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { meili } from './syncing-engine';

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

export const loadAllEntries = async () => {
  meili.read();
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
