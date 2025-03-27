import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError } from "zod";

export const validateSchema =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      } else {
        next(error); 
      }
    }
  };

export const validateSchemaPartial =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.partial().parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
