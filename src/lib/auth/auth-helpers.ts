import { createDir, writeTextFile } from '@tauri-apps/api/fs';
import { redirect } from 'react-router-dom';

import { ACCESS_TOKEN, SAFE_LOCATION_KEY } from '../constants';
import { getData } from '../storage';

export const checkIfLoggedIn = async () => {
  const safe = Boolean(await getData(SAFE_LOCATION_KEY));

  if (safe) {
    return null;
  }

  return redirect('/auth');
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
    await createDir(`${basePath}/${months[index].toLowerCase()}`, { recursive: true });
  }

  // create today directory
  await createDir(`${basePath}/today`, { recursive: true });

  // create highlights directory
  await createDir(`${basePath}/highlights`, { recursive: true });

  // create initial files
  for (let index = 0; index < files.length; index++) {
    await writeTextFile(`${name}/${files[index]}`, JSON.stringify({}));
  }
};
