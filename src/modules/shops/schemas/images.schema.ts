import { z } from "zod";

export const imagesSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  image_url: z.string({
    invalid_type_error: "El campo 'image_url' debe ser de tipo string.",
    required_error: "El campo 'image_url' es requerido."
  })
    .min(1, { message: "El campo 'image_url' debe tener al menos 1 carácter." })
}).strict();

