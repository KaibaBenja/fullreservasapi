import dotenv from "dotenv";
import { validateEnv } from "../utils/validateEnv";

dotenv.config();

export const PORT = parseInt(process.env.PORT ?? "3300", 10);
export const HOST = process.env.HOST ?? "localhost"
export const CORS_ORIGIN = validateEnv("CORS_ORIGIN", process.env.CORS_ORIGIN);

export const MYSQL = {
  HOST: validateEnv("MYSQL_HOST", process.env.MYSQL_HOST),
  PORT: parseInt(validateEnv("MYSQL_PORT", process.env.MYSQL_PORT), 10),
  USER: validateEnv("MYSQL_USER", process.env.MYSQL_USER),
  PASSWORD: validateEnv("MYSQL_PASSWORD", process.env.MYSQL_PASSWORD),
  DATABASE: validateEnv("MYSQL_DATABASE", process.env.MYSQL_DATABASE),
};

export const R2 = {
  ENDPOINT: validateEnv(
    "CLOUDFLARE_ENDPOINT",
    process.env.CLOUDFLARE_R2_ENDPOINT
  ),
  CLOUDFLARE_R2_ACCESS_KEY: validateEnv(
    "CLOUDFLARE_R2_ACCESS_KEY",
    process.env.CLOUDFLARE_R2_ACCESS_KEY
  ),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: validateEnv(
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  ),
  CLOUDFLARE_R2_BUCKET_NAME: validateEnv(
    "CLOUDFLARE_R2_BUCKET_NAME",
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  ),
  CLOUDFLARE_R2_PUBLIC_URL: validateEnv(
    "CLOUDFLARE_R2_PUBLIC_URL",
    process.env.CLOUDFLARE_R2_PUBLIC_URL
  ),
};

export const emailService = {
  transporter: {
    host: validateEnv(
      "EMAIL_SERVICE_TRANSPORTER_HOST",
      process.env.EMAIL_SERVICE_TRANSPORTER_HOST
    ),
    port: Number(validateEnv(
      "EMAIL_SERVICE_TRANSPORTER_PORT",
      process.env.EMAIL_SERVICE_TRANSPORTER_PORT
    )),
    auth: {
      user: validateEnv(
        "EMAIL_SERVICE_TRANSPORTER_AUTH_USER",
        process.env.EMAIL_SERVICE_TRANSPORTER_AUTH_USER
      ),
      pass: validateEnv(
        "EMAIL_SERVICE_TRANSPORTER_AUTH_PASS",
        process.env.EMAIL_SERVICE_TRANSPORTER_AUTH_PASS
      ),
    }
  },
  options: {
    from: validateEnv(
      "EMAIL_SERVICE_MAIL_OPTIONS_FROM",
      process.env.EMAIL_SERVICE_MAIL_OPTIONS_FROM
    ),
  }
}