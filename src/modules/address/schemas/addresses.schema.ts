import { z } from "zod";

export const addressesSchema = z.object({
  street: z.string({
    invalid_type_error: "El campo 'street' debe ser de tipo string.",
    required_error: "El campo 'street' es requerido."
  })
    .min(1, { message: "El campo 'street' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'street' no puede tener más de 255 caracteres." }),

  street_number: z.string({
    invalid_type_error: "El campo 'street_number' debe ser de tipo string.",
    required_error: "El campo 'street_number' es requerido."
  })
    .min(1, { message: "El campo 'street_number' debe tener al menos 1 carácter." })
    .max(10, { message: "El campo 'street_number' no puede tener más de 10 caracteres." }),

  extra: z.string({
    invalid_type_error: "El campo 'extra' debe ser de tipo string.",
    required_error: "El campo 'extra' es requerido."
  })
    .min(1, { message: "El campo 'extra' debe tener al menos 1 carácter." })
    .max(100, { message: "El campo 'extra' no puede tener más de 10 caracteres." })
    .optional(),

  city_id: z.string({
    invalid_type_error: "El campo 'city_id' debe ser de tipo string.",
    required_error: "El campo 'city_id' es requerido."
  }).uuid({ message: "El campo 'city_id' debe ser un UUID válido." }),

  province_id: z.string({
    invalid_type_error: "El campo 'province_id' debe ser de tipo string.",
    required_error: "El campo 'province_id' es requerido."
  }).uuid({ message: "El campo 'province_id' debe ser un UUID válido." }),

  country_id: z.string({
    invalid_type_error: "El campo 'country_id' debe ser de tipo string.",
    required_error: "El campo 'country_id' es requerido."
  }).uuid({ message: "El campo 'country_id' debe ser un UUID válido." }),

  description: z.string({
    invalid_type_error: "El campo 'description' debe ser de tipo string.",
    required_error: "El campo 'description' es requerido."
  })
    .min(1, { message: "El campo 'description' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'description' no puede tener más de 255 caracteres." })
    .optional(),

  latitude: z.number({
    invalid_type_error: "El campo 'latitude' debe ser de tipo number.",
    required_error: "El campo 'latitude' es requerido."
  }).min(-90).max(90),

  longitude: z.number({
    invalid_type_error: "El campo 'longitude' debe ser de tipo number.",
    required_error: "El campo 'longitude' es requerido."
  }).min(-180).max(180),
}).strict();

