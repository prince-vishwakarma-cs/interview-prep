import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT

export const MONGO_URI = process.env.MONGO_URI

export const FRONTEND_URL =  process.env.FRONTEND_URL;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const JWT_SECRET = process.env.JWT_SECRET;

export const NODE_ENV = process.env.NODE_ENV;

export const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "None";

export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const IS_SECURE = NODE_ENV === "production";