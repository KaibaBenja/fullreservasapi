import dotenv from "dotenv";
import { validateEnv } from "../utils/validateEnv";

dotenv.config();

export const PORT = parseInt(process.env.PORT ?? '8080', 10);
export const HOST = process.env.HOST ?? 'localhost';

export const CORS_ORIGIN = validateEnv('CORS_ORIGIN', process.env.CORS_ORIGIN);

export const MYSQL = {
  HOST: process.env.MYSQL_HOST ?? 'localhost',
  PORT: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  USER: validateEnv('MYSQL_USER', process.env.MYSQL_USER),
  PASSWORD: validateEnv('MYSQL_PASSWORD', process.env.MYSQL_PASSWORD),
  DATABASE: validateEnv('MYSQL_DATABASE', process.env.MYSQL_DATABASE),
};
