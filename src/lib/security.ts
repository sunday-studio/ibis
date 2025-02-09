import bcrypt from 'bcryptjs';

export const encryptPin = async (pin: string) => {
  const salt = await bcrypt.genSalt(import.meta.env.VITE_SALT_ROUNDS);
  const hashedPin = await bcrypt.hash(pin, salt);
  return {
    salt,
    hashedPin,
  };
};

export const verifyPin = async (pin: string, hashedPin: string) => {
  return await bcrypt.compare(pin, hashedPin);
};

export const generateRecoveryToken = () => {
  const saltRounds = parseInt(import.meta.env.VITE_SALT_ROUNDS, 10);
  const salt = bcrypt.genSaltSync(saltRounds);

  const randomString = crypto.randomUUID();
  const token = bcrypt.hashSync(randomString, salt);

  return token;
};
