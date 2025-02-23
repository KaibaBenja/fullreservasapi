import { z } from "zod";

export const countrySchema = z.object({
  name: z.string({
    invalid_type_error: "El campo 'name' debe ser de tipo string.",
    required_error: "El campo 'name' es requerido."
  })
    .min(1, { message: "El campo 'name' debe tener al menos 1 caracteres." })
    .max(255, { message: "El campo 'name' no puede tener más de 255 caracteres." }),

}).strict();

