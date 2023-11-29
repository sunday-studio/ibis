import { createDir, exists, writeTextFile } from '@tauri-apps/api/fs';
import { redirect } from 'react-router-dom';

import { SAFE_LOCATION_KEY } from '../constants';
import { getData } from '../storage';

export const checkIfLoggedIn = async () => {
  const safe = Boolean(await getData(SAFE_LOCATION_KEY));

  if (safe) {
    return null;
  }

  return redirect('/auth');
};

const createNewDirectory = async (path: string) => {
  const directoryExist = exists(path);
  if (!directoryExist) {
    createDir(path, { recursive: true });
  }
};

export const generateNewDirectory = async (name: string) => {
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

  const files = ['index.json', 'tags.json'];

  // create months
  for (let index = 0; index < months.length; index++) {
    await createDir(`${basePath}/${months[index].toLowerCase()}`);
  }

  // create today directory
  await createNewDirectory(`${basePath}/today`);

  // create highlights directory
  await createNewDirectory(`${basePath}/highlights`);

  // create initial files
  for (let index = 0; index < files.length; index++) {
    const path = `${name}/${files[index]}`;
    const fileExist = await exists(path);
    if (!fileExist) {
      await writeTextFile(`${name}/${files[index]}`, JSON.stringify({}));
    }
  }
};
