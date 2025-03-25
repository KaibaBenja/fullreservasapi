import { ZodError, ZodSchema, ZodObject } from 'zod';
import { Response } from 'express';

export const zodValidateData = <T>(
  schema: ZodSchema<any>,
  data: any,
  res?: Response
): { isValid: boolean; data?: any; errors?: any[] } => {
  try {
    if (schema instanceof ZodObject && typeof data === 'string') {
      const schemaKeys = Object.keys(schema.shape);
      
      if (schemaKeys.length === 1) {
        const key = schemaKeys[0];
        const wrappedData = { [key]: data };
        
        const validatedData = schema.parse(wrappedData);
        return {
          isValid: true,
          data: validatedData
        };
      }
    }
    
    const validatedData = schema.parse(data);
    return {
      isValid: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof ZodError) {
      if (res) {
        res.status(400).json({
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      
      return {
        isValid: false,
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        }))
      };
    } 
    
    if (res) {
      res.status(500).json({ error: 'Error de validación inesperado' });
    }
    
    throw error;
  }
};