import bcrypt from "bcrypt";

export const hashFunc = (value) => {
  try {
    return bcrypt.hash(value, 10);
  } catch (error) {
    throw new Error("hashingError");
  }
};

export const compareFunc = (value, hashedValue) => {
  try {
    return bcrypt.compare(value, hashedValue);
  } catch (error) {
    throw new Error("hashCompareError");
  }
};
