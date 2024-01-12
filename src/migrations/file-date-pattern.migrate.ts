import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { meili } from '@/lib/data-engine/syncing-engine';
import { months } from '@/lib/data-engine/syncing-helpers';
import { getData } from '@/lib/storage';
import { getDateInStringFormat } from '@/store/daily-state';

const renameUrl = (url: string, createdAt: string) => {
  // rename today files
  if (url.includes('today')) {
    const urlPaths = url.split('/');
    const oldFilenameIndex = urlPaths.length - 1;
    const newFilename = getDateInStringFormat(new Date(createdAt));

    urlPaths[oldFilenameIndex] = newFilename;
    const newURL = urlPaths.join('/');
    return `${newURL}.json`;
  }

  const isEntryUrl = months.some((month) => url.includes(month.toLowerCase()));

  // entries renaming
  if (isEntryUrl) {
    const urlPaths = url.split('/');
    const oldFilenameIndex = urlPaths.length - 1;
    const oldFilenamePaths = urlPaths[oldFilenameIndex].split('-');

    if (oldFilenamePaths.length === 3) return url;
    const newDateUrl = `${getDateInStringFormat(new Date(createdAt))}.${oldFilenamePaths[1]}`;
    urlPaths[oldFilenameIndex] = newDateUrl;

    return urlPaths.join('/');
  }

  return url;
};

const migrateFileDatePattern = async (data: { url: string; date: string }[]) => {
  const SAFE_URL = getData(SAFE_LOCATION_KEY);

  const promises = data.map(async ({ url, date }: { url: string; date: string }) => {
    const newURL = `${SAFE_URL}${renameUrl(url.replace(SAFE_URL, '').toLowerCase(), date)}`;

    return await meili.renameFile(url, newURL);
  });

  await Promise.all(promises);
};

export async function runMigration() {
  const SAFE_URL = getData(SAFE_LOCATION_KEY);
  const flatUrls = await meili.readDirectoryContent(SAFE_URL);

  const promises = flatUrls.map(async (url: string) => {
    return {
      url,
      content: await meili.readFileContent(url),
    };
  });
  const content = await Promise.all(promises);
  const dataToRename = content.map((data) => {
    return {
      url: data.url,
      date: data?.content?.createdAt || data?.content?.date,
    };
  });

  migrateFileDatePattern(dataToRename);
}
