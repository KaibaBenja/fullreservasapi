import { z } from "zod";

export const provinceSchema = z.object({
  name: z.string({
    invalid_type_error: "El campo 'name' debe ser de tipo string.",
    required_error: "El campo 'name' es requerido."
  })
    .min(1, { message: "El campo 'name' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'name' no puede tener más de 255 caracteres." }),

  country_id: z.string({
    invalid_type_error: "El campo 'country_id' debe ser de tipo string.",
    required_error: "El campo 'country_id' es requerido."
  }).uuid({ message: "El campo 'country_id' debe ser un UUID válido." })
}).strict();

