import { useMutation, useQuery } from '@tanstack/react-query';
import { DatabaseType, db } from '.';
import { encryptPin, verifyPin } from '@/lib/security';

enum UserKeys {
  USER = 'user',
}

async function getUser(database: DatabaseType, userId: string) {
  return await database?.select('SELECT * FROM users WHERE id = ?', [userId]);
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

  return await verifyPin(params.pin, pin);
}

// react query hooks

export const useGetUser = () => {
  return useQuery({
    queryKey: [UserKeys.USER],
    queryFn: () => getUser(db.getDb(), '1'),
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
