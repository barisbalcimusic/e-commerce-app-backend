const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const testPassword = (password) => {
  return passwordRegex.test(password);
};
