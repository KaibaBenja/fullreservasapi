import { z } from "zod";

export const membershipsPlansSchema = z.object({
  tier_name: z.string({
    invalid_type_error: "El campo 'tierName' debe ser de tipo string.",
    required_error: "El campo 'tierName' es requerido."
  })
    .trim()
    .min(1, { message: "El campo 'tierName' debe tener al menos un carácter." })
    .max(50, { message: "El campo 'tierName' debe tener como máximo 50 carácteres." }),

  price: z.number({
    invalid_type_error: "El campo 'price' debe ser de tipo number.",
    required_error: "El campo 'price' es requerido."
  })
    .min(0, { message: "El campo 'price' debe ser como mínimo 0." })
    .max(100000000, { message: "El campo 'price' debe ser como máximo 100000000." }),

  quantity: z.number({
    invalid_type_error: "El campo 'quantity' debe ser de tipo number.",
    required_error: "El campo 'quantity' es requerido."
  })
    .min(0, { message: "El campo 'quantity' debe ser como mínimo 0." })
    .max(10, { message: "El campo 'quantity' debe ser como máximo 10." }),

  description: z.string({
    invalid_type_error: "El campo 'description' debe ser de tipo string.",
    required_error: "El campo 'description' es requerido."
  })
    .trim()
    .min(1, { message: "El campo 'description' debe tener al menos un carácter." })
    .optional()
}).strict();
