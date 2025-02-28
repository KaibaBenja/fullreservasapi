import { z } from "zod";
import { Response } from "express";
export const uuidSchema = z.string().uuid();

export const handleErrorResponse = (
  res: Response,
  status: number,
  message: string
) => {
  res.status(status).json({ message });
};

export const isValidUUID = (id: string): boolean => {
  return uuidSchema.safeParse(id).success;
};

export const validateUUID = (id: string, res: Response): boolean => {
  if (!id || !isValidUUID(id)) {
    handleErrorResponse(res, 400, "ID inválido, no tiene formato UUID");
    return false;
  }
  return true;
};
