import bcrypt from "bcrypt";

export const PashBcrypt = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const ComparePass = async (userPass, hashPash) => {
  return await bcrypt.compare(userPass, hashPash);
};
