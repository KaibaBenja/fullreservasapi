import { z } from "zod";

export const citiesSchema = z.object({
  name: z.string({
    invalid_type_error: "El campo 'name' debe ser de tipo string.",
    required_error: "El campo 'name' es requerido."
  })
    .min(1, { message: "El campo 'name' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'name' no puede tener más de 255 caracteres." }),

  zip_code: z.string({
    invalid_type_error: "El campo 'zip_code' debe ser de tipo string.",
    required_error: "El campo 'zip_code' es requerido."
  })
    .min(1, { message: "El campo 'zip_code' debe tener al menos 1 carácter." })
    .max(10, { message: "El campo 'zip_code' no puede tener más de 10 caracteres." }),

  province_id: z.string({
    invalid_type_error: "El campo 'province_id' debe ser de tipo string.",
    required_error: "El campo 'province_id' es requerido."
  }).uuid({ message: "El campo 'province_id' debe ser un UUID válido." })
}).strict();

