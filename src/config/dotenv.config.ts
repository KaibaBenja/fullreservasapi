import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT ?? '8080', 10); // El 10 es el formato de conversión (Decimal)
export const HOST = process.env.HOST ?? 'localhost';
export const CORS_ORIGIN = process.env.CORS_ORIGIN;