import jwt from "jsonwebtoken";

// GENERATE ACCESS TOKEN
export const generateaccessToken = (userId, firstname, accessTokenSecret) => {
  return jwt.sign({ userId, firstname }, accessTokenSecret, {
    expiresIn: "1d",
  });
};

// VERIFY ACCESS TOKEN
export const verifyAccessToken = (token, accessTokenSecret) => {
  return jwt.verify(token, accessTokenSecret, (err, payload) => {
    if (err) {
      return err;
    }
    return payload;
  });
};
