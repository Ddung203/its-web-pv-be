import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashFunction = async (plaintext: string) => {
  return bcrypt.hashSync(plaintext, SALT_ROUNDS);
};

const compareFunction = async (plaintext: string, hashedString: string) => {
  return bcrypt.compareSync(plaintext, hashedString);
};

const compareString = (plaintext: string, hashedString: string) => {
  console.log("plaintext :>> ", plaintext);
  console.log("hashedString :>> ", hashedString);
  return plaintext === hashedString;
};

export { hashFunction, compareFunction, compareString };
