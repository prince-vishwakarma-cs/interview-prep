import jwt from "jsonwebtoken";
import {
    COOKIE_MAX_AGE,
    COOKIE_SAME_SITE,
    IS_SECURE,
    JWT_EXPIRES_IN,
    JWT_SECRET,
} from "./variables.js";

const cookieOptions = {
  httpOnly: true,
  secure: IS_SECURE,
  sameSite: COOKIE_SAME_SITE,
  maxAge: parseInt(COOKIE_MAX_AGE, 10),
};

export const setTokenCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

export const clearTokenCookie = (res) => {
  res.clearCookie("token", cookieOptions);
};

export const generateToken = (userId) => {
  if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
  }

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const SaltRounds = 10;
