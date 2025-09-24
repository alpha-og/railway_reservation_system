import jwt from "jsonwebtoken";
import config from "./config.js";

export const getToken = (user) => {
  const token = jwt.sign(
    { userId: user.id, roleId: user.role_id },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    },
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (err) {
    return null;
  }
};
