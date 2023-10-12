import { redirect } from 'react-router-dom';

import { ACCESS_TOKEN } from '../constants';
import { getData } from '../storage';

export const checkIfLoggedIn = async (args: any) => {
  const hasToken = Boolean(await getData(ACCESS_TOKEN));

  if (hasToken) {
    return null;
  }
  return redirect('/auth');
};

// const loader = async () => {
//   try {
//     const res = await fetch('/api/userprofile');
//     if (!res.ok) {
//       throw Error('User Invalid');
//     }
//   } catch (error) {
//     return redirect('/login');
//   }
// };
