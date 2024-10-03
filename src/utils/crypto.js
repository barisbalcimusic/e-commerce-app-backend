import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Error hashing the password");
  }
};

export const comparePasswords = (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};
