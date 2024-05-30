import { createDir, exists, writeTextFile } from '@tauri-apps/api/fs';

import { seedDefaultEntries, seedPinnedEntry } from '@/migrations/seed/entries.seed';
import { generateIndexSeed } from '@/migrations/seed/index.seed';
import { seedDefaultJournal } from '@/migrations/seed/journal.seed';

const createNewDirectory = async (path: string) => {
  const directoryExist = await exists(path);

  if (!directoryExist) {
    await createDir(path, { recursive: true });
  }

  return;
};

export const generateNewDirectory = async (name: string) => {
  // check if index exist then return early
  const indexExist = await exists(`${name}/index.json`);
  if (indexExist) {
    return;
  }

  const currentYear = new Date().getFullYear().toString();
  const basePath = `${name}/${currentYear}`;

  const months = [
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

  // const files = ['index.json', 'tags.json'];

  // create months
  for (let index = 0; index < months.length; index++) {
    await createNewDirectory(`${basePath}/${months[index].toLowerCase()}`);
  }

  // create today directory
  await createNewDirectory(`${basePath}/today`);

  // seed new directory with dummy data
  try {
    const pinnedEntryId = await seedPinnedEntry(name);
    await writeTextFile(
      `${name}/index.json`,
      JSON.stringify(generateIndexSeed({ pinnedId: pinnedEntryId })),
    );
    await seedDefaultJournal(name);
    await seedDefaultEntries(name);
  } catch (error) {
    console.log('trying to seed app => ', error);
  }
};
