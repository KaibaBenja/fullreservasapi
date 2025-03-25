import { z } from "zod";

export const operatorsSchema = z.object({
  full_name: z.string({
    invalid_type_error: "El campo 'full_name' debe ser de tipo string.",
    required_error: "El campo 'full_name' es requerido."
  })
    .min(1, { message: "El campo 'full_name' debe tener al menos 1 caracteres." })
    .max(255, { message: "El campo 'full_name' no puede tener más de 255 caracteres." }),

  password: z.string({
    invalid_type_error: "El campo 'password' debe ser de tipo string.",
    required_error: "El campo 'password' es requerido."
  })
    .min(8, { message: "El campo 'password' debe tener al menos 8 caracteres." })
    .max(128, { message: "El campo 'password' no puede tener más de 128 caracteres." })
    .regex(/[A-Z]/, { message: "El campo 'password' debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "El campo 'password' debe contener al menos una letra minúscula." })
    .regex(/[0-9]/, { message: "El campo 'password' debe contener al menos un número." })
    .regex(/[^A-Za-z0-9]/, { message: "El campo 'password' debe contener al menos un carácter especial." })
    .refine(value => !/\s/.test(value), {
      message: "El campo 'password' no debe contener espacios en blanco."
    }),

  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),
}).strict();

