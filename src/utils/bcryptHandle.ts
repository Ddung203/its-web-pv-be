import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashFunction = async (plaintext: string) => {
  return bcrypt.hashSync(plaintext, SALT_ROUNDS);
};

const compareFunction = async (plaintext: string, hashedString: string) => {
  return bcrypt.compareSync(plaintext, hashedString);
};

const compareString = async (plaintext: string, hashedString: string) => {
  return plaintext === hashedString;
};

export { hashFunction, compareFunction, compareString };
