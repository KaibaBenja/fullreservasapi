import { z } from "zod";
export const uuidSchema = z.string().uuid();
import { handleErrorResponse } from "./handleErrorResponse";
import { Response } from "express";


export const isValidUUID = (id: string): boolean => {
  return uuidSchema.safeParse(id).success;
};

export const validateUUID = (id: string, res: Response): boolean => {
  if (!id || !isValidUUID(id)) {
    handleErrorResponse(res, 400, `El ID: ${id} es inválido, no tiene formato UUID`);
    return false;
  }
  return true;
};
