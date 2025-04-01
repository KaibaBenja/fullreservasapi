import { z } from "zod";

const priceRange = [1, 2, 3, 4];
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const shopsSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  subcategory_id: z.string({
    invalid_type_error: "El campo 'subcategory_id' debe ser de tipo string.",
    required_error: "El campo 'subcategory_id' es requerido."
  }).uuid({ message: "El campo 'subcategory_id' debe ser un UUID válido." }),

  name: z.string({
    invalid_type_error: "El campo 'name' debe ser de tipo string.",
    required_error: "El campo 'name' es requerido."
  })
    .min(1, { message: "El campo 'name' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'name' no puede tener más de 255 caracteres." }),

  phone_number: z.string({
    invalid_type_error: "El campo 'phone_number' debe ser de tipo string.",
    required_error: "El campo 'phone_number' es requerido."
  })
    .min(1, { message: "El campo 'phone_number' debe tener al menos 1 carácter." })
    .max(45, { message: "El campo 'phone_number' no puede tener más de 45 caracteres." }),

  shift_type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["SINGLESHIFT", "DOUBLESHIFT", "CONTINUOUS"], {
      errorMap: () => ({ message: "El campo 'shift_type' solo puede ser 'SINGLESHIFT', 'DOUBLESHIFT', 'CONTINUOUS'." })
    })
  ),

  average_stay_time: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'average_stay_time' debe ser de tipo número.",
      required_error: "El campo 'average_stay_time' es requerido.",
    })
  ),

  capacity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'capacity' debe ser de tipo número.",
      required_error: "El campo 'capacity' es requerido.",
    }).refine((val) => val <= 99999, {
      message: "El campo 'capacity' no puede tener más de 5 dígitos.",
    })
  ),

  legal_info: z.string({
    invalid_type_error: "El campo 'legal_info' debe ser de tipo string.",
    required_error: "El campo 'legal_info' es requerido."
  })
    .min(1, { message: "El campo 'legal_info' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'legal_info' no puede tener más de 255 caracteres." }),

  bank_info: z.string({
    invalid_type_error: "El campo 'bank_info' debe ser de tipo string.",
    required_error: "El campo 'bank_info' es requerido."
  })
    .min(1, { message: "El campo 'bank_info' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'bank_info' no puede tener más de 255 caracteres." }),

  description: z.string({
    invalid_type_error: "El campo 'description' debe ser de tipo string.",
    required_error: "El campo 'description' es requerido."
  })
    .min(1, { message: "El campo 'description' debe tener al menos 1 carácter." })
    .max(300, { message: "El campo 'description' no puede tener más de 255 caracteres." })
    .optional(),

  price_range: z.number({
    invalid_type_error: "El campo 'price_range' debe ser un número válido."
  }).refine((val) => priceRange.includes(val), {
    message: `El campo "price_range" debe ser uno de los siguientes valores: ${priceRange.join(', ')}`
  }),
}).strict();


export const filterShopSchema = shopsSchema.extend({
  id: z.string({
    invalid_type_error: "El campo 'id' debe ser de tipo string.",
    required_error: "El campo 'id' es requerido."
  }).uuid({ message: "El campo 'id' debe ser un UUID válido." }),

  subcategory_name: z.string({
    invalid_type_error: "El campo 'subcategory_name' debe ser de tipo string.",
    required_error: "El campo 'subcategory_name' es requerido."
  })
    .min(1, { message: "El campo 'subcategory_name' debe tener al menos 1 carácter." })
    .max(100, { message: "El campo 'subcategory_name' no puede tener más de 100 caracteres." }),

  main_category: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["COMMERCE", "SERVICE"], {
      errorMap: () => ({ message: "El campo 'main_category' solo puede ser 'COMMERCE' o 'SERVICE'." })
    })
  )
});

export const filterShopSchemaUser = filterShopSchema.omit({
  user_id: true,
  subcategory_id: true,
  phone_number: true,
  legal_info: true,
  bank_info: true,
});

export const createShopSchema = shopsSchema.extend({
  open_time1: z.string({
    invalid_type_error: "El campo 'open_time1' debe ser de tipo string.",
    required_error: "El campo 'open_time1' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm" }),

  close_time1: z.string({
    invalid_type_error: "El campo 'close_time1' debe ser de tipo string.",
    required_error: "El campo 'close_time1' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm" }),

  open_time2: z.string({
    invalid_type_error: "El campo 'open_time2' debe ser de tipo string.",
    required_error: "El campo 'open_time2' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm" })
    .optional(),

  close_time2: z.string({
    invalid_type_error: "El campo 'close_time2' debe ser de tipo string.",
    required_error: "El campo 'close_time2' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm" })
    .optional()
});
