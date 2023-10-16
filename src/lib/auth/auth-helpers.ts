import { createDir } from '@tauri-apps/api/fs';
import { redirect } from 'react-router-dom';

import { ACCESS_TOKEN } from '../constants';
import { getData } from '../storage';

export const checkIfLoggedIn = async () => {
  const hasToken = Boolean(await getData(ACCESS_TOKEN));

  if (hasToken) {
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

  // create months
  for (let index = 0; index < months.length; index++) {
    await createDir(`${basePath}/${months[index].toLowerCase()}`, { recursive: true });
  }

  // create today directory
  await createDir(`${basePath}/today`);
};
