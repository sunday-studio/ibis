import { useMutation, useQuery } from '@tanstack/react-query';
import { DatabaseType, db } from '.';
import { encryptPin, generateRecoveryToken, verifyPin } from '@/lib/security';
import { User } from './types';

enum UserKeys {
  USER = 'user',
}

async function getUser(database: DatabaseType) {
  const users = (await database?.select('SELECT * FROM users')) as User[];
  if (users.length === 0) {
    return null;
  }
  return users[0];
}

async function setUserPin(database: DatabaseType, params: { pin: string; userId: string }) {
  const encryptedPin = await encryptPin(params.pin);
  return await database?.execute('UPDATE users SET pin = ? WHERE id = ?', [
    encryptedPin.hashedPin,
    params.userId,
  ]);
}

async function verifyUserPin(database: DatabaseType, params: { pin: string; userId: string }) {
  const userPin = (await database?.select('SELECT pin FROM users WHERE id = ?', [
    params.userId,
  ])) as { pin: string }[];

  const { pin } = userPin[0];

  try {
    const test = await verifyPin(params.pin, pin);

    if (!test) {
      throw new Error('Invalid PIN');
    }
  } catch (error) {
    throw new Error('Invalid PIN');
  }
}

async function createUser(
  database: DatabaseType,
  params: { name: string; email: string; pin: string },
) {
  const encryptedPin = await encryptPin(params.pin);
  const recoveryToken = generateRecoveryToken();

  await database?.execute(
    'INSERT INTO users (name, email, pin, recoveryToken) VALUES (?, ?, ?, ?)',
    [params.name, params.email, encryptedPin.hashedPin, recoveryToken],
  );

  return recoveryToken;
}

async function deleteUser(database: DatabaseType) {
  return await database?.execute('DELETE FROM users');
}

// react query hooks
export const useGetUser = () => {
  return useQuery({
    queryKey: [UserKeys.USER],
    queryFn: () => getUser(db.getDb()),
  });
};

export const useSetUserPin = () => {
  return useMutation({
    mutationFn: (params: { pin: string; userId: string }) => setUserPin(db.getDb(), params),
  });
};

export const useVerifyUserPin = () => {
  return useMutation({
    mutationFn: (params: { pin: string; userId: string }) => verifyUserPin(db.getDb(), params),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (params: { name: string; email: string; pin: string }) =>
      createUser(db.getDb(), params),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: () => deleteUser(db.getDb()),
  });
};
