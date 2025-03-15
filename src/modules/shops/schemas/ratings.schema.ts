import { z } from "zod";

const validRatings = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

export const ratingsSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),
  
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),
  
  booking_id: z.string({
    invalid_type_error: "El campo 'booking_id' debe ser de tipo string.",
    required_error: "El campo 'booking_id' es requerido."
  }).uuid({ message: "El campo 'booking_id' debe ser un UUID válido." }),

  rating: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number({
       invalid_type_error: "El campo 'rating' debe ser de tipo number."
    }).refine((val) => validRatings.includes(val), {
      message: "El rating debe ser uno de los siguientes valores: 1.0, 1.5, ..., 5.0",
    })
  ),

  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["PENDING", "COMPLETED"], {
      errorMap: () => ({ message: "El campo 'status' solo puede ser 'PENDING' o 'COMPLETED'." })
    })
  ),

  comment: z.string({
    invalid_type_error: "El campo 'comment' debe ser de tipo string.",
    required_error: "El campo 'comment' es requerido."
  })
    .min(1, { message: "El campo 'comment' debe tener al menos 1 caracteres." })
    .max(200, { message: "El campo 'comment' no puede tener más de 200 caracteres." })
    .optional(),
}).strict();

