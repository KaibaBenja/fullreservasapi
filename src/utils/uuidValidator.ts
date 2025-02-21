import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const isValidUUID = (id: string): boolean => {
  return uuidSchema.safeParse(id).success;
};