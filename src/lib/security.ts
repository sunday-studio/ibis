import crypto from 'crypto';

export const encrypt = (data: any) => {
  return crypto.encrypt(data);
};

export const decrypt = (data: any) => {
  return crypto.decrypt(data);
};

export const generatedRevokedToken = () => {
  return crypto.randomBytes(process.env.VITE_CRYPTO_SECRET).toString('hex');
};
